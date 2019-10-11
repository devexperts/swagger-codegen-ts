import { getJSDoc, getURL, HTTPMethod } from '../../common/utils';
import { serializedType, SerializedType } from '../../common/data/serialized-type';
import { OpenAPIV3 } from 'openapi-types';
import { serializePathParameterObject, serializePathParameterObjectDescription } from './parameter-object';
import * as nullable from '../../../../utils/nullable';
import { pipe } from 'fp-ts/lib/pipeable';
import { filter, flatten, map as mapArray } from 'fp-ts/lib/Array';
import { sequenceEither, sequenceTEither } from '../../../../utils/either';
import { dependency } from '../../common/data/serialized-dependency';
import { serializeResponsesObject } from './responses-object';
import { Dereference, resolveReference } from '../utils';
import { flow } from 'fp-ts/lib/function';
import { array, either } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';

export const serializeOperationObject = (
	dereference: Dereference,
	pattern: string,
	method: HTTPMethod,
	rootName: string,
	cwd: string,
) => (operation: OpenAPIV3.OperationObject): Either<Error, SerializedType> => {
	const parameters = operation.parameters || [];
	const operationName = getOperationName(operation, method);

	const resolved = pipe(
		parameters,
		mapArray(p =>
			resolveReference(
				dereference,
				p,
				ref => new Error(`Unable to resolve parameter "${ref}" for operation "${operationName}"`),
			),
		),
		sequenceEither,
	);
	const pathParameters = pipe(
		resolved,
		either.map(filter(p => p.in === 'path')),
	);
	// const queryParameters = resolved.filter(p => p.in === 'query');
	// const bodyParameters = resolved.filter(p => p.in === 'body');

	const pathParamsSummary = pipe(
		pathParameters,
		either.chain(
			flow(
				array.map(serializePathParameterObjectDescription(dereference)),
				sequenceEither,
			),
		),
	);

	const deprecated = pipe(
		operation.deprecated,
		nullable.map(() => '@deprecated'),
	);

	const serializedPathParameters = pipe(
		pathParameters,
		either.chain(
			flow(
				array.map(serializePathParameterObject(dereference)),
				sequenceEither,
			),
		),
	);

	const serializedResponses = pipe(
		operation.responses,
		either.fromNullable(new Error('Operation should contain responses field')),
		either.chain(serializeResponsesObject(rootName, cwd, dereference)),
	);

	return pipe(
		sequenceTEither(pathParameters, serializedPathParameters, pathParamsSummary, serializedResponses),
		either.map(([pathParameters, serializedPathParameters, pathParamsSummary, serializedResponses]) => {
			const serializedUrl = getURL(pattern, serializedPathParameters);

			const argsName = pipe(
				pathParameters,
				mapArray(p => p.name),
			).join(',');

			const argsType = pipe(
				serializedPathParameters,
				mapArray(p => p.type),
			).join(',');

			const type = `
				${getJSDoc(nullable.compactNullables([deprecated, operation.summary, ...pathParamsSummary]))}
				readonly ${operationName}: (${argsType}) => LiveData<Error, unknown>;
			`;

			const io = `
				${operationName}: (${argsName}) => {
					return e.apiClient
						.request({
							url: ${serializedUrl},
							method: '${method}'
						});
				},
			`;

			const dependencies = [
				dependency('LiveData', '@devexperts/rx-utils/dist/rd/live-data.utils'),
				...pipe(
					serializedPathParameters,
					mapArray(p => p.dependencies),
					flatten,
				),
			];

			return serializedType(type, io, dependencies, []);
		}),
	);
};

const getOperationName = (operation: OpenAPIV3.OperationObject, method: HTTPMethod): string =>
	pipe(
		operation.operationId,
		nullable.getOrElse(() => method.toString()),
	);
