import { OperationObject } from '../../../../schema/2.0/operation-object';
import { serializedType, SerializedType } from '../data/serialized-type';
import {
	getOperationParametersInBody,
	getOperationParametersInPath,
	getOperationParametersInQuery,
} from '../../../../utils';
import { serializePathParameter, serializePathParameterDescription } from './path-parameter-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { exists, getOrElse, map, none, Option, some } from 'fp-ts/lib/Option';
import { array, flatten } from 'fp-ts/lib/Array';
import { serializeOperationResponses } from './responses-object';
import { fromArray } from 'fp-ts/lib/NonEmptyArray';
import { serializeQueryParameterObjects } from './query-parameter-object';
import { serializeBodyParameterObjects } from './body-parameter-object';
import { intercalateSerializedParameters, serializedParameter } from '../data/serialized-parameter';
import { dependency, EMPTY_DEPENDENCIES } from '../data/serialized-dependency';
import { EMPTY_REFS, getRelativeClientPath } from '../utils';
import { SerializedPathParameter } from '../data/serialized-path-parameter';
import { identity } from 'fp-ts/lib/function';
import { QueryParameterObject } from '../../../../schema/2.0/parameter-object/query-parameter-object/query-parameter-object';
import { BodyParameterObject } from '../../../../schema/2.0/parameter-object/body-parameter-object';
import { concatIf, concatIfL } from '../../../../utils/array';
import { unless, when } from '../../../../utils/string';

export const serializeOperationObject = (
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
	operation: OperationObject,
	rootName: string,
	cwd: string,
): SerializedType => {
	const pathParameters = getOperationParametersInPath(operation);
	const queryParameters = getOperationParametersInQuery(operation);
	const bodyParameters = getOperationParametersInBody(operation);

	const pathParamsSummary = pathParameters.map(serializePathParameterDescription);
	const paramsSummary = serializeParametersDescription([...queryParameters, ...bodyParameters]);

	const deprecated = pipe(
		operation.deprecated,
		map(() => `@deprecated`),
	);

	const serializedPathParameters = pathParameters.map(serializePathParameter);

	const serializedResponses = serializeOperationResponses(operation.responses, rootName, cwd);

	const operationName = getOperationName(operation, method);

	const serializedUrl = serializeURL(url, serializedPathParameters);

	const serializedQueryParameters = pipe(
		fromArray(queryParameters),
		map(queryParameters => serializeQueryParameterObjects(queryParameters)),
	);
	const serializedBodyParameters = pipe(
		fromArray(bodyParameters),
		map(bodyParameters => serializeBodyParameterObjects(bodyParameters, rootName, cwd)),
	);

	const serializedParameters = intercalateSerializedParameters(
		serializedParameter(',', ',', false, EMPTY_DEPENDENCIES, EMPTY_REFS),
		array.compact([serializedQueryParameters, serializedBodyParameters]),
	);

	const hasQueryParameters = queryParameters.length > 0;
	const hasBodyParameters = bodyParameters.length > 0;
	const hasParameters = hasQueryParameters || hasBodyParameters;

	const argsName = concatIf(hasParameters, pathParameters.map(p => p.name), ['parameters']).join(',');
	const argsType = concatIfL(hasParameters, serializedPathParameters.map(p => p.type), () => [
		`parameters: { ${serializedParameters.type} }`,
	]).join(',');

	const type = `
		${jsdoc(array.compact([deprecated, operation.summary, ...pathParamsSummary.map(some), paramsSummary]))}
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
			dependency('map', 'rxjs/operators'),
			dependency('fromEither', '@devexperts/remote-data-ts'),
			dependency('chain', '@devexperts/remote-data-ts'),
			dependency('ResponseValidationError', getRelativeClientPath(cwd)),
			dependency('LiveData', '@devexperts/rx-utils/dist/rd/live-data.utils'),
			dependency('pipe', 'fp-ts/lib/pipeable'),
			dependency('mapLeft', 'fp-ts/lib/Either'),
			...flatten(serializedPathParameters.map(parameter => parameter.dependencies)),
			...serializedResponses.dependencies,
			...serializedParameters.dependencies,
		],
		() => [dependency('partial', 'io-ts')],
	);

	return serializedType(type, io, dependencies, serializedParameters.refs);
};

const jsdoc = (lines: string[]): string =>
	unless(
		lines.length === 0,
		`/** 
			 ${lines.map(line => `* ${line}`).join('\n')}
		 */`,
	);

const serializeURL = (url: string, pathParameters: SerializedPathParameter[]): string =>
	pathParameters.reduce(
		(acc, p) => acc.replace(`{${p.name}}`, `\$\{encodeURIComponent(${p.io}.toString())\}`),
		`\`${url}\``,
	);

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
