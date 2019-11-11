import { Context, getJSDoc, getKindValue, getURL, HTTPMethod } from '../../common/utils';
import {
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRefType,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { isRequired, serializeParameterObject } from './parameter-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { getSerializedKindDependency, serializedDependency } from '../../common/data/serialized-dependency';
import { serializeResponsesObject } from './responses-object';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	serializedParameter,
	SerializedParameter,
	getSerializedPropertyParameter,
} from '../../common/data/serialized-parameter';
import {
	fromSerializedParameter,
	getSerializedPathParameterType,
	SerializedPathParameter,
} from '../../common/data/serialized-path-parameter';
import { concatIf, concatIfL } from '../../../../utils/array';
import { when } from '../../../../utils/string';
import { serializeRequestBodyObject } from './request-body-object';
import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { OperationObject } from '../../../../schema/3.0/operation-object';
import { ParameterObject, ParameterObjectCodec } from '../../../../schema/3.0/parameter-object';
import { RequestBodyObjectCodec } from '../../../../schema/3.0/request-body-object';
import { isSome, none, Option, some } from 'fp-ts/lib/Option';
import { constFalse } from 'fp-ts/lib/function';
import { clientRef } from '../../common/client';
import { Kind } from '../../../../utils/types';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { ask } from 'fp-ts/lib/Reader';

const getOperationName = (operation: OperationObject, method: HTTPMethod): string =>
	pipe(
		operation.operationId,
		option.getOrElse(() => method.toString()),
	);

interface Parameters {
	readonly pathParameters: ParameterObject[];
	readonly serializedPathParameters: SerializedPathParameter[];
	readonly serializedQueryParameter: Option<SerializedParameter>;
	readonly serializedBodyParameter: Option<SerializedParameter>;
}

const eqParameterByNameAndIn: Eq<ParameterObject> = getStructEq({
	name: eqString,
	in: eqString,
});
const contains = array.elem(eqParameterByNameAndIn);

const getParameters = combineReader(
	ask<Context>(),
	e => (from: Ref, operation: OperationObject, pathItem: PathItemObject): Either<Error, Parameters> => {
		const processedParameters: ParameterObject[] = [];
		const pathParameters: ParameterObject[] = [];
		const serializedPathParameters: SerializedPathParameter[] = [];
		const serializedQueryParameters: SerializedParameter[] = [];
		let serializedBodyParameter: Option<SerializedParameter> = none;

		const parameters = pipe(
			// note that PathItem parameters should go after OperationObject parameters because they have lower priority
			// this means that OperationObject can override PathItemObject parameters
			[operation.parameters, pathItem.parameters],
			array.compact,
			array.flatten,
		);

		for (const parameter of parameters) {
			if (ReferenceObjectCodec.is(parameter)) {
				const reference = fromString(parameter.$ref);
				if (isLeft(reference)) {
					return reference;
				}
				const resolved = pipe(
					parameter,
					e.resolveRef,
					ParameterObjectCodec.decode,
					either.mapLeft(() => new Error(`Unable to resolve parameter with ref ${reference.right.$ref}`)),
				);
				if (isLeft(resolved)) {
					return resolved;
				}
				// if parameter has already been processed then skip it
				if (contains(resolved.right, processedParameters)) {
					continue;
				}
				processedParameters.push(resolved.right);
				const serializedReference = pipe(
					reference.right,
					getSerializedRefType(from),
				);

				switch (resolved.right.in) {
					case 'path': {
						pathParameters.push(resolved.right);
						const serialized = pipe(
							serializedReference,
							fromSerializedType(true),
							fromSerializedParameter(resolved.right.name),
							getSerializedPathParameterType,
						);
						serializedPathParameters.push(serialized);
						break;
					}
					case 'query': {
						const serialized = pipe(
							serializedReference,
							getSerializedPropertyType(resolved.right.name, isRequired(resolved.right)),
							fromSerializedType(isRequired(resolved.right)),
						);
						serializedQueryParameters.push(serialized);
						break;
					}
					case 'header':
						break;
					case 'cookie': {
						break;
					}
				}
			} else {
				// if parameter has already been processed then skip it
				if (contains(parameter, processedParameters)) {
					continue;
				}
				processedParameters.push(parameter);
				switch (parameter.in) {
					case 'path': {
						const serialized = pipe(
							serializeParameterObject(from, parameter),
							either.map(fromSerializedParameter(parameter.name)),
							either.map(getSerializedPathParameterType),
						);
						if (isLeft(serialized)) {
							return serialized;
						}
						pathParameters.push(parameter);
						serializedPathParameters.push(serialized.right);
						break;
					}
					case 'query': {
						const serialized = pipe(
							serializeParameterObject(from, parameter),
							either.map(getSerializedPropertyType(parameter.name, isRequired(parameter))),
							either.map(fromSerializedType(isRequired(parameter))),
						);
						if (isLeft(serialized)) {
							return serialized;
						}
						serializedQueryParameters.push(serialized.right);
						break;
					}
					case 'header':
						break;
					case 'cookie': {
						break;
					}
				}
			}
		}

		if (isSome(operation.requestBody)) {
			const requestBody = operation.requestBody.value;
			if (ReferenceObjectCodec.is(requestBody)) {
				const reference = fromString(requestBody.$ref);
				if (isLeft(reference)) {
					return left(new Error(`Invalid RequestBodyObject.$ref "${requestBody.$ref}"`));
				}
				const resolved = option.fromEither(RequestBodyObjectCodec.decode(e.resolveRef(requestBody)));

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
					serialized => getSerializedPropertyParameter('body', serialized),
					some,
				);
			} else {
				const serialized = pipe(
					serializeRequestBodyObject(from, requestBody),
					either.map(
						fromSerializedType(
							pipe(
								requestBody.required,
								option.getOrElse(constFalse),
							),
						),
					),
					either.map(serialized => getSerializedPropertyParameter('body', serialized)),
				);
				if (isLeft(serialized)) {
					return serialized;
				}
				serializedBodyParameter = some(serialized.right);
			}
		}

		const serializedQueryParameter = pipe(
			nonEmptyArray.fromArray(serializedQueryParameters),
			option.map(parameters => {
				const intercalated = intercalateSerializedParameters(
					serializedParameter(';', ',', false, [], []),
					parameters,
				);
				return pipe(
					intercalated,
					getSerializedObjectType(),
					fromSerializedType(intercalated.isRequired),
					serialized => getSerializedPropertyParameter('query', serialized),
				);
			}),
		);

		return right({
			pathParameters,
			serializedPathParameters,
			serializedQueryParameter,
			serializedBodyParameter,
		});
	},
);

export const serializeOperationObject = combineReader(
	getParameters,
	getParameters => (
		pattern: string,
		method: HTTPMethod,
		from: Ref,
		kind: Kind,
		operation: OperationObject,
		pathItem: PathItemObject,
	): Either<Error, SerializedType> => {
		const parameters = getParameters(from, operation, pathItem);
		const operationName = getOperationName(operation, method);

		const deprecated = pipe(
			operation.deprecated,
			option.map(() => '@deprecated'),
		);

		const serializedResponses = serializeResponsesObject(from)(operation.responses);

		return combineEither(
			parameters,
			serializedResponses,
			clientRef,
			(parameters, serializedResponses, clientRef) => {
				const serializedParameters = intercalateSerializedParameters(
					serializedParameter(',', ',', false, [], []),
					array.compact([parameters.serializedQueryParameter, parameters.serializedBodyParameter]),
				);
				const hasQueryParameters = isSome(parameters.serializedQueryParameter);
				const hasBodyParameter = isSome(parameters.serializedBodyParameter);
				const hasParameters = hasQueryParameters || hasBodyParameter;

				const argsType = concatIf(hasParameters, parameters.serializedPathParameters.map(p => p.type), [
					`parameters: { ${serializedParameters.type} }`,
				]);

				const type = `
					${getJSDoc(array.compact([deprecated, operation.summary]))}
					readonly ${operationName}: (${argsType}) => ${getKindValue(kind, serializedResponses.type)};
				`;

				const argsName = concatIf(hasParameters, parameters.pathParameters.map(p => p.name), [
					'parameters',
				]).join(',');

				const io = `
					${operationName}: (${argsName}) => {
						${when(hasParameters, `const encoded = partial({ ${serializedParameters.io} }).encode(parameters);`)}
	
						return e.httpClient.chain(
							e.httpClient.request({
								url: ${getURL(pattern, parameters.serializedPathParameters)},
								method: '${method}',
								${when(hasQueryParameters, 'query: encoded.query,')}
								${when(hasBodyParameter, 'body: encoded.body,')}
							}),
							value =>
								pipe(
									${serializedResponses.io}.decode(value),
									either.mapLeft(ResponseValidationError.create),
									either.fold(error => e.httpClient.throwError(error), decoded => e.httpClient.of(decoded)),
								),
						);
					},
				`;

				const dependencies = concatIfL(
					hasParameters,
					[
						serializedDependency('ResponseValidationError', getRelativePath(from, clientRef)),
						serializedDependency('pipe', 'fp-ts/lib/pipeable'),
						serializedDependency('either', 'fp-ts'),
						getSerializedKindDependency(kind),
						...pipe(
							parameters.serializedPathParameters,
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
						parameters.serializedPathParameters,
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
