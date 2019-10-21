import { getJSDoc, getRelativeClientPath, getURL, HTTPMethod } from '../../common/utils';
import { getSerializedRefType, serializedType, SerializedType } from '../../common/data/serialized-type';
import { OpenAPIV3 } from 'openapi-types';
import {
	serializePathParameterObject,
	serializeQueryParameterObject,
	foldSerializedQueryParameters,
} from './parameter-object';
import * as nullable from '../../../../utils/nullable';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { serializeResponsesObject } from './responses-object';
import { array, either } from 'fp-ts';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { isReferenceObject, resolveReferenceObject } from './reference-object';
import { isNonNullable, isNullable, Nullable } from '../../../../utils/nullable';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
	SerializedParameter,
} from '../../common/data/serialized-parameter';
import { fromSerializedParameter, SerializedPathParameter } from '../../common/data/serialized-path-parameter';
import { concatIf, concatIfL } from '../../../../utils/array';
import { unless, when } from '../../../../utils/string';
import { serializeRequestBodyObject } from './request-body-object';
import { fromArray } from '../../../../utils/non-empty-array';
import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../utils';

const getOperationName = (operation: OpenAPIV3.OperationObject, method: HTTPMethod): string =>
	pipe(
		operation.operationId,
		nullable.getOrElse(() => method.toString()),
	);

interface Parameters {
	readonly pathParameters: OpenAPIV3.ParameterObject[];
	readonly serializedPathParameters: SerializedPathParameter[];
	readonly serializedQueryParameters: Nullable<SerializedParameter>;
	readonly serializedBodyParameter: Nullable<SerializedParameter>;
}

const getParameters = combineReader(
	resolveReferenceObject,
	resolveReferenceObject => (from: Ref) => (operation: OpenAPIV3.OperationObject): Either<Error, Parameters> => {
		const pathParameters: OpenAPIV3.ParameterObject[] = [];
		const serializedPathParameters: SerializedPathParameter[] = [];
		const serializedQueryParameters: SerializedParameter[] = [];
		let serializedBodyParameter: Nullable<SerializedParameter>;

		for (const parameter of operation.parameters || []) {
			if (isReferenceObject(parameter)) {
				const reference = fromString(parameter.$ref);
				if (isLeft(reference)) {
					return reference;
				}
				const resolved = resolveReferenceObject<OpenAPIV3.ParameterObject>(parameter);
				if (!isNonNullable(resolved)) {
					return left(new Error(`Unable to resolve parameter with ref ${reference.right.$ref}`));
				}
				const serializedReference = pipe(
					reference.right,
					getSerializedRefType(from),
				);

				switch (resolved.in) {
					case 'query': {
						serializedQueryParameters.push(
							pipe(
								serializedReference,
								fromSerializedType(resolved.required || false),
							),
						);
						break;
					}
					case 'header':
						break;
					case 'formData':
						break;
					case 'path': {
						pathParameters.push(resolved);
						serializedPathParameters.push(
							pipe(
								serializedReference,
								fromSerializedType(true),
								fromSerializedParameter(resolved.name),
							),
						);
						break;
					}
					default: {
						return left(
							new Error(
								`Unsupported ParameterObject "in" value "${resolved.in}" for parameter "${
									resolved.name
								}"`,
							),
						);
					}
				}
			} else {
				switch (parameter.in) {
					case 'query': {
						const serialized = serializeQueryParameterObject(from)(parameter);
						if (isLeft(serialized)) {
							return serialized;
						}
						serializedQueryParameters.push(serialized.right);
						break;
					}
					case 'header':
						break;
					case 'formData':
						break;
					case 'path': {
						const serialized = serializePathParameterObject(from)(parameter);
						if (isLeft(serialized)) {
							return serialized;
						}
						pathParameters.push(parameter);
						serializedPathParameters.push(serialized.right);
						break;
					}
					default: {
						return left(
							new Error(
								`Unsupported ParameterObject "in" value: ${parameter.in} for parameter "${
									parameter.name
								}"`,
							),
						);
					}
				}
			}
		}

		if (isNonNullable(operation.requestBody)) {
			if (isReferenceObject(operation.requestBody)) {
				const reference = fromString(operation.requestBody.$ref);
				if (isLeft(reference)) {
					return left(new Error(`Invalid RequestBodyObject.$ref "${operation.requestBody.$ref}"`));
				}
				const resolved = resolveReferenceObject<OpenAPIV3.RequestBodyObject>(operation.requestBody);
				if (!isNonNullable(resolved)) {
					return left(
						new Error(`Unable to resolve RequestBodyObject with ref ${operation.requestBody.$ref}`),
					);
				}
				const serializedReference = pipe(
					reference.right,
					getSerializedRefType(from),
				);
				if (!isNonNullable(serializedReference)) {
					return left(new Error(`Unable to serialize RequestBodyObject ref ${operation.requestBody.$ref}`));
				}

				serializedBodyParameter = pipe(
					serializedReference,
					fromSerializedType(resolved.required || false),
					toBodyParameter,
				);
			} else {
				const serialized = pipe(
					operation.requestBody,
					serializeRequestBodyObject(from),
					either.map(fromSerializedType(operation.requestBody.required || false)),
					either.map(toBodyParameter),
				);
				if (isLeft(serialized)) {
					return serialized;
				}
				serializedBodyParameter = serialized.right;
			}
		}

		return right({
			pathParameters,
			serializedPathParameters,
			serializedQueryParameters: pipe(
				serializedQueryParameters,
				fromArray,
				nullable.map(foldSerializedQueryParameters),
			),
			serializedBodyParameter,
		});
	},
);

export const serializeOperationObject = combineReader(
	getParameters,
	getParameters => (pattern: string, method: HTTPMethod, from: Ref) => (
		operation: OpenAPIV3.OperationObject,
	): Either<Error, SerializedType> => {
		const parameters = getParameters(from)(operation);
		const operationName = getOperationName(operation, method);

		const deprecated = pipe(
			operation.deprecated,
			nullable.map(() => '@deprecated'),
		);

		const serializedResponses = pipe(
			operation.responses,
			either.fromNullable(new Error('Operation should contain responses field')),
			either.chain(serializeResponsesObject(from)),
		);

		return combineEither(
			parameters,
			serializedResponses,
			clientRef,
			(parameters, serializedResponses, clientRef) => {
				const {
					serializedPathParameters,
					pathParameters,
					serializedQueryParameters,
					serializedBodyParameter,
				} = parameters;
				const serializedUrl = getURL(pattern, serializedPathParameters);

				const serializedParameters = intercalateSerializedParameters(
					serializedParameter(',', ';', false, [], []),
					nullable.compactNullables([serializedQueryParameters, serializedBodyParameter]),
				);
				const hasQueryParameters = isNonNullable(serializedQueryParameters);
				const hasBodyParameter = isNonNullable(serializedBodyParameter);
				const hasParameters = hasQueryParameters || hasBodyParameter;

				const argsName = pipe(
					pathParameters,
					array.map(p => p.name),
					names => concatIf(hasParameters, names, ['parameters']),
				).join(',');

				const argsType = pipe(
					serializedPathParameters,
					array.map(p => p.type),
					types => concatIf(hasParameters, types, [`parameters: { ${serializedParameters.type} }`]),
				).join(',');

				const type = `
				${getJSDoc(nullable.compactNullables([deprecated, operation.summary]))}
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
							${when(hasBodyParameter, 'body: encoded.body,')}
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
						...pipe(
							serializedPathParameters,
							array.map(p => p.dependencies),
							array.flatten,
						),
						...serializedResponses.dependencies,
						...serializedParameters.dependencies,
					],
					() => [serializedDependency('partial', 'io-ts')],
				);

				const refs = [
					...pipe(
						serializedPathParameters,
						array.map(p => p.refs),
						array.flatten,
					),
					...serializedResponses.refs,
					...serializedParameters.refs,
				];

				return serializedType(type, io, dependencies, refs);
			},
		);
	},
);

const toBodyParameter = (serialized: SerializedParameter): SerializedParameter =>
	serializedParameter(
		`body${unless(serialized.isRequired, '?')}: ${serialized.type}`,
		`body: ${serialized.io}`,
		serialized.isRequired,
		serialized.dependencies,
		serialized.refs,
	);
