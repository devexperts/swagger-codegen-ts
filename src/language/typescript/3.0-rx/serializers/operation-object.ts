import { getJSDoc, getURL, HTTPMethod } from '../../common/utils';
import { getSerializedRefType, serializedType, SerializedType } from '../../common/data/serialized-type';
import {
	serializePathParameterObject,
	serializeQueryParameterObject,
	foldSerializedQueryParameters,
} from './parameter-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { serializeResponsesObject } from './responses-object';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { isReferenceObject, resolveReferenceObject } from './reference-object';
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
import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { OperationObject } from '../../../../schema/3.0/operation-object';
import { ParameterObject, ParameterObjectCodec } from '../../../../schema/3.0/parameter-object';
import { RequestBodyObjectCodec } from '../../../../schema/3.0/request-body-object';
import { isSome, none, Option, some } from 'fp-ts/lib/Option';
import { ReferenceObject } from '../../../../schema/3.0/reference-object';
import { constFalse } from 'fp-ts/lib/function';
import { clientRef } from '../../common/client';

const getOperationName = (operation: OperationObject, method: HTTPMethod): string =>
	pipe(
		operation.operationId,
		option.getOrElse(() => method.toString()),
	);

interface Parameters {
	readonly pathParameters: ParameterObject[];
	readonly serializedPathParameters: SerializedPathParameter[];
	readonly serializedQueryParameters: Option<SerializedParameter>;
	readonly serializedBodyParameter: Option<SerializedParameter>;
}

const getParameters = combineReader(
	resolveReferenceObject,
	resolveReferenceObject => (from: Ref) => (operation: OperationObject): Either<Error, Parameters> => {
		const pathParameters: ParameterObject[] = [];
		const serializedPathParameters: SerializedPathParameter[] = [];
		const serializedQueryParameters: SerializedParameter[] = [];
		let serializedBodyParameter: Option<SerializedParameter> = none;

		const parameters = pipe(
			operation.parameters,
			option.getOrElse<Array<ReferenceObject | ParameterObject>>(() => array.empty),
		);

		for (const parameter of parameters) {
			if (isReferenceObject(parameter)) {
				const reference = fromString(parameter.$ref);
				if (isLeft(reference)) {
					return reference;
				}
				const resolved = pipe(
					parameter,
					resolveReferenceObject,
					ParameterObjectCodec.decode,
					option.fromEither,
				);
				if (!isSome(resolved)) {
					return left(new Error(`Unable to resolve parameter with ref ${reference.right.$ref}`));
				}
				const serializedReference = pipe(
					reference.right,
					getSerializedRefType(from),
				);

				switch (resolved.value.in) {
					case 'query': {
						serializedQueryParameters.push(
							pipe(
								serializedReference,
								fromSerializedType(
									pipe(
										resolved.value.required,
										option.getOrElse(constFalse),
									),
								),
							),
						);
						break;
					}
					case 'header':
						break;
					case 'path': {
						pathParameters.push(resolved.value);
						serializedPathParameters.push(
							pipe(
								serializedReference,
								fromSerializedType(true),
								fromSerializedParameter(resolved.value.name),
							),
						);
						break;
					}
					default: {
						return left(
							new Error(
								`Unsupported ParameterObject "in" value "${resolved.value.in}" for parameter "${
									resolved.value.name
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

		if (isSome(operation.requestBody)) {
			const requestBody = operation.requestBody.value;
			if (isReferenceObject(requestBody)) {
				const reference = fromString(requestBody.$ref);
				if (isLeft(reference)) {
					return left(new Error(`Invalid RequestBodyObject.$ref "${requestBody.$ref}"`));
				}
				const resolved = option.fromEither(RequestBodyObjectCodec.decode(resolveReferenceObject(requestBody)));

				if (!isSome(resolved)) {
					return left(new Error(`Unable to resolve RequestBodyObject with ref ${requestBody.$ref}`));
				}
				const serializedReference = pipe(
					reference.right,
					getSerializedRefType(from),
				);

				serializedBodyParameter = pipe(
					serializedReference,
					fromSerializedType(
						pipe(
							resolved.value.required,
							option.getOrElse(constFalse),
						),
					),
					toBodyParameter,
					some,
				);
			} else {
				const serialized = pipe(
					requestBody,
					serializeRequestBodyObject(from),
					either.map(
						fromSerializedType(
							pipe(
								requestBody.required,
								option.getOrElse(constFalse),
							),
						),
					),
					either.map(toBodyParameter),
				);
				if (isLeft(serialized)) {
					return serialized;
				}
				serializedBodyParameter = some(serialized.right);
			}
		}

		return right({
			pathParameters,
			serializedPathParameters,
			serializedQueryParameters: pipe(
				nonEmptyArray.fromArray(serializedQueryParameters),
				option.map(foldSerializedQueryParameters),
			),
			serializedBodyParameter,
		});
	},
);

export const serializeOperationObject = combineReader(
	getParameters,
	getParameters => (pattern: string, method: HTTPMethod, from: Ref) => (
		operation: OperationObject,
	): Either<Error, SerializedType> => {
		const parameters = getParameters(from)(operation);
		const operationName = getOperationName(operation, method);

		const deprecated = pipe(
			operation.deprecated,
			option.map(() => '@deprecated'),
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
					array.compact([serializedQueryParameters, serializedBodyParameter]),
				);
				const hasQueryParameters = isSome(serializedQueryParameters);
				const hasBodyParameter = isSome(serializedBodyParameter);
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
				${getJSDoc(array.compact([deprecated, operation.summary]))}
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
