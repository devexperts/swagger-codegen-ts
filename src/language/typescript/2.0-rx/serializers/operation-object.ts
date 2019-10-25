import { OperationObject } from '../../../../schema/2.0/operation-object';
import { serializedType, SerializedType } from '../../common/data/serialized-type';
import { serializePathParameter, serializePathParameterDescription } from './path-parameter-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { exists, getOrElse, map, none, Option, some } from 'fp-ts/lib/Option';
import { flatten } from 'fp-ts/lib/Array';
import { serializeOperationResponses } from './responses-object';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { serializeQueryParameterObjects } from './query-parameter-object';
import { serializeBodyParameterObjects } from './body-parameter-object';
import { intercalateSerializedParameters, serializedParameter } from '../../common/data/serialized-parameter';
import { serializedDependency, EMPTY_DEPENDENCIES } from '../../common/data/serialized-dependency';
import { constant, identity } from 'fp-ts/lib/function';
import { QueryParameterObject } from '../../../../schema/2.0/parameter-object/query-parameter-object/query-parameter-object';
import { BodyParameterObject } from '../../../../schema/2.0/parameter-object/body-parameter-object';
import { concatIf, concatIfL } from '../../../../utils/array';
import { when } from '../../../../utils/string';
import { getURL, HTTPMethod, getJSDoc } from '../../common/utils';
import { Either, right } from 'fp-ts/lib/Either';
import { either, array } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/client';
import { ParameterObject } from '../../../../schema/2.0/parameter-object/parameter-object';
import { ReferenceObject } from '../../../../schema/2.0/reference-object';
import { PathParameterObject } from '../../../../schema/2.0/parameter-object/path-parameter-object/path-parameter-object';

export const serializeOperationObject = (
	from: Ref,
	url: string,
	method: HTTPMethod,
	operation: OperationObject,
): Either<Error, SerializedType> => {
	const pathParameters = getOperationParametersInPath(operation);
	const queryParameters = getOperationParametersInQuery(operation);
	const bodyParameters = getOperationParametersInBody(operation);
	const hasQueryParameters = queryParameters.length > 0;
	const hasBodyParameters = bodyParameters.length > 0;
	const hasParameters = hasQueryParameters || hasBodyParameters;

	const pathParamsSummary = pathParameters.map(serializePathParameterDescription);
	const paramsSummary = serializeParametersDescription([...queryParameters, ...bodyParameters]);

	const deprecated = pipe(
		operation.deprecated,
		map(() => `@deprecated`),
	);

	const serializedPathParameters = pathParameters.map(serializePathParameter);

	const serializedResponses = serializeOperationResponses(from, operation.responses);

	const operationName = getOperationName(operation, method);

	const serializedUrl = getURL(url, serializedPathParameters);

	const serializedQueryParameters = pipe(
		fromArray(queryParameters),
		map(queryParameters => right(serializeQueryParameterObjects(queryParameters))),
	);
	const serializedBodyParameters = pipe(
		fromArray(bodyParameters),
		map(bodyParameters => serializeBodyParameterObjects(from, bodyParameters)),
	);

	const serializedParameters = pipe(
		array.compact([serializedQueryParameters, serializedBodyParameters]),
		sequenceEither,
		either.map(parameters =>
			intercalateSerializedParameters(serializedParameter(',', ',', false, EMPTY_DEPENDENCIES, []), parameters),
		),
	);

	return combineEither(
		serializedResponses,
		serializedParameters,
		clientRef,
		(serializedResponses, serializedParameters, clientRef) => {
			const argsName = concatIf(hasParameters, pathParameters.map(p => p.name), ['parameters']).join(',');
			const argsType = concatIfL(hasParameters, serializedPathParameters.map(p => p.type), () => [
				`parameters: { ${serializedParameters.type} }`,
			]).join(',');

			const type = `
				${getJSDoc(array.compact([deprecated, operation.summary, ...pathParamsSummary.map(some), paramsSummary]))}
				readonly ${operationName}: (${argsType}) => LiveData<Error, ${serializedResponses.type}>;
			`;

			const io = `
				${operationName}: (${argsName}) => {
					${when(hasParameters, `const encoded = partial({ ${serializedParameters.io} }).encode(parameters);`)}
			
					return e.apiClient
						.request({
							url: ${serializedUrl},
							method: '${method}',
							${when(hasQueryParameters, 'query: encoded.query,')}
							${when(hasBodyParameters, 'body: encoded.body,')}
						})
						.pipe(
							map(data =>
								pipe(
									data,
									chain(value =>
										fromEither<Error, ${serializedResponses.type}>(
											pipe(
												${serializedResponses.io}.decode(value),
												mapLeft(ResponseValidationError.create),
											),
										),
									),
								),
							),
						);
				},
			`;

			const dependencies = concatIfL(
				hasParameters,
				[
					serializedDependency('map', 'rxjs/operators'),
					serializedDependency('fromEither', '@devexperts/remote-data-ts'),
					serializedDependency('chain', '@devexperts/remote-data-ts'),
					serializedDependency('ResponseValidationError', getRelativePath(from, clientRef)),
					serializedDependency('LiveData', '@devexperts/rx-utils/dist/rd/live-data.utils'),
					serializedDependency('pipe', 'fp-ts/lib/pipeable'),
					serializedDependency('mapLeft', 'fp-ts/lib/Either'),
					...flatten(serializedPathParameters.map(parameter => parameter.dependencies)),
					...serializedResponses.dependencies,
					...serializedParameters.dependencies,
				],
				() => [serializedDependency('partial', 'io-ts')],
			);

			return serializedType(type, io, dependencies, serializedParameters.refs);
		},
	);
};

const getOperationName = (operation: OperationObject, httpMethod: string) =>
	pipe(
		operation.operationId,
		getOrElse(() => httpMethod),
	);

const serializeParametersDescription = (
	parameters: Array<QueryParameterObject | BodyParameterObject>,
): Option<string> => {
	const hasRequiredParameters = parameters.some(p =>
		pipe(
			p.required,
			exists(identity),
		),
	);
	return parameters.length === 0
		? none
		: some(hasRequiredParameters ? '@param { object } parameters' : '@param { object } [parameters]');
};

const isOperationNonReferenceParameterObject = (
	parameter: ReferenceObject | ParameterObject,
): parameter is ParameterObject => !ReferenceObject.is(parameter);

const isPathParameterObject = (parameter: ParameterObject): parameter is PathParameterObject => parameter.in === 'path';
const isOperationPathParameterObject = (
	parameter: ReferenceObject | ParameterObject,
): parameter is PathParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isPathParameterObject(parameter);
export const getOperationParametersInPath = (operation: OperationObject): PathParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationPathParameterObject)),
		getOrElse(constant<PathParameterObject[]>([])),
	);

const isQueryParameterObject = (parameter: ParameterObject): parameter is QueryParameterObject =>
	parameter.in === 'query';
const isOperationQueryParameterObject = (
	parameter: ReferenceObject | ParameterObject,
): parameter is QueryParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isQueryParameterObject(parameter);
export const getOperationParametersInQuery = (operation: OperationObject): QueryParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationQueryParameterObject)),
		getOrElse(constant<QueryParameterObject[]>([])),
	);

const isBodyParameterObject = (parameter: ParameterObject): parameter is BodyParameterObject => parameter.in === 'body';
const isOperationBodyParameterObject = (
	parameter: ReferenceObject | ParameterObject,
): parameter is BodyParameterObject =>
	isOperationNonReferenceParameterObject(parameter) && isBodyParameterObject(parameter);
export const getOperationParametersInBody = (operation: OperationObject): BodyParameterObject[] =>
	pipe(
		operation.parameters,
		map(parameters => parameters.filter(isOperationBodyParameterObject)),
		getOrElse(constant<BodyParameterObject[]>([])),
	);
