import { OperationObject } from '../../../../schema/2.0/operation-object';
import {
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRefType,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { getOrElse, map, Option } from 'fp-ts/lib/Option';
import { flatten } from 'fp-ts/lib/Array';
import { serializeOperationResponses } from './responses-object';
import { fromArray, head, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	fromSerializedType,
	intercalateSerializedParameters,
	SerializedParameter,
	serializedParameter,
} from '../../common/data/serialized-parameter';
import {
	EMPTY_DEPENDENCIES,
	getSerializedKindDependency,
	serializedDependency,
} from '../../common/data/serialized-dependency';
import { concatIf, concatIfL } from '../../../../utils/array';
import { unless, when } from '../../../../utils/string';
import { Context, getJSDoc, getURL, HTTPMethod, getKindValue } from '../../common/utils';
import { Either, isLeft, right } from 'fp-ts/lib/Either';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/bundled/client';
import {
	BodyParameterObject,
	FormDataParameterObject,
	HeaderParameterObject,
	ParameterObject,
	ParameterObjectCodec,
	PathParameterObject,
	QueryParameterObject,
} from '../../../../schema/2.0/parameter-object';
import { ReferenceObjectCodec } from '../../../../schema/2.0/reference-object';
import { isRequired, serializeParameterObject } from './parameter-object';
import {
	fromSerializedParameter,
	getSerializedPathParameterType,
	SerializedPathParameter,
} from '../../common/data/serialized-path-parameter';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { ask } from 'fp-ts/lib/Reader';
import { serializeSchemaObject } from './schema-object';
import { traverseArrayEither } from '../../../../utils/either';
import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { Kind } from '../../../../utils/types';

interface Parameters {
	readonly pathParameters: PathParameterObject[];
	readonly serializedPathParameters: SerializedPathParameter[];
	readonly queryParameters: QueryParameterObject[];
	readonly serializedQueryParameter: Option<SerializedParameter>;
	readonly bodyParameters: BodyParameterObject[];
	readonly headerParameters: HeaderParameterObject[];
	readonly formDataParameters: FormDataParameterObject[];
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
		const pathParameters: PathParameterObject[] = [];
		const serializedPathParameters: SerializedPathParameter[] = [];
		const queryParameters: QueryParameterObject[] = [];
		const serializedQueryParameters: SerializedParameter[] = [];
		const bodyParameters: BodyParameterObject[] = [];
		const headerParameters: HeaderParameterObject[] = [];
		const formDataParameters: FormDataParameterObject[] = [];

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
					either.mapLeft(() => new Error(`Unable to resolve parameter with $ref "${parameter.$ref}"`)),
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
							fromSerializedType(resolved.right.required),
							fromSerializedParameter(resolved.right.name),
							getSerializedPathParameterType,
						);
						serializedPathParameters.push(serialized);
						break;
					}
					case 'query': {
						queryParameters.push(resolved.right);
						serializedQueryParameters.push(
							pipe(
								serializedReference,
								fromSerializedType(isRequired(resolved.right)),
							),
						);
						break;
					}
					case 'body': {
						bodyParameters.push(resolved.right);
						break;
					}
					case 'header': {
						headerParameters.push(resolved.right);
						break;
					}
					case 'formData': {
						formDataParameters.push(resolved.right);
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
						queryParameters.push(parameter);
						break;
					}
					case 'body': {
						bodyParameters.push(parameter);
						break;
					}
					case 'header': {
						headerParameters.push(parameter);
						break;
					}
					case 'formData': {
						formDataParameters.push(parameter);
						break;
					}
				}
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
					getSerializedPropertyType('query', intercalated.isRequired),
					fromSerializedType(intercalated.isRequired),
				);
			}),
		);

		return right({
			pathParameters,
			serializedPathParameters,
			queryParameters,
			serializedQueryParameter,
			bodyParameters,
			headerParameters,
			formDataParameters,
		});
	},
);

export const serializeOperationObject = combineReader(
	getParameters,
	getParameters => (
		from: Ref,
		url: string,
		method: HTTPMethod,
		kind: Kind,
		operation: OperationObject,
		pathItem: PathItemObject,
	): Either<Error, SerializedType> => {
		const parameters = getParameters(from, operation, pathItem);
		const operationName = getOperationName(operation, method);

		const serializedResponses = serializeOperationResponses(from, operation.responses);

		const deprecated = pipe(
			operation.deprecated,
			map(() => `@deprecated`),
		);

		const serializedParameters = pipe(
			parameters,
			either.chain(parameters => {
				const serializedQueryParameters = pipe(
					fromArray(parameters.queryParameters),
					map(queryParameters => serializeQueryParameterObjects(from, queryParameters)),
				);
				const serializedBodyParameters = pipe(
					fromArray(parameters.bodyParameters),
					map(bodyParameters => serializeBodyParameterObjects(from, bodyParameters)),
				);

				return pipe(
					array.compact([serializedQueryParameters, serializedBodyParameters]),
					sequenceEither,
					either.map(parameters =>
						intercalateSerializedParameters(
							serializedParameter(',', ',', false, EMPTY_DEPENDENCIES, []),
							parameters,
						),
					),
				);
			}),
		);

		return combineEither(
			parameters,
			serializedResponses,
			serializedParameters,
			clientRef,
			(parameters, serializedResponses, serializedParameters, clientRef) => {
				const hasQueryParameters = parameters.queryParameters.length > 0;
				const hasBodyParameters = parameters.bodyParameters.length > 0;
				const hasParameters = hasQueryParameters || hasBodyParameters;

				const argsType = concatIfL(hasParameters, parameters.serializedPathParameters.map(p => p.type), () => [
					`parameters: { ${serializedParameters.type} }`,
				]).join(',');

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
								url: ${getURL(url, parameters.serializedPathParameters)},
								method: '${method}',
								${when(hasQueryParameters, 'query: encoded.query,')}
								${when(hasBodyParameters, 'body: encoded.body,')}
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
						...flatten(parameters.serializedPathParameters.map(parameter => parameter.dependencies)),
						...serializedResponses.dependencies,
						...serializedParameters.dependencies,
					],
					() => [serializedDependency('partial', 'io-ts')],
				);

				return serializedType(type, io, dependencies, serializedParameters.refs);
			},
		);
	},
);

const getOperationName = (operation: OperationObject, httpMethod: string) =>
	pipe(
		operation.operationId,
		getOrElse(() => httpMethod),
	);

const serializeBodyParameterObjects = (
	from: Ref,
	parameters: NonEmptyArray<BodyParameterObject>,
): Either<Error, SerializedParameter> => {
	// according to spec there can be only one body parameter
	const parameter = head(parameters);
	return pipe(
		serializeSchemaObject(from, parameter.schema),
		either.map(fromSerializedType(isRequired(parameter))),
		either.map(serializedBodyParameter => {
			const { type, isRequired, io, dependencies, refs } = serializedBodyParameter;
			return serializedParameter(
				`body${unless(isRequired, '?')}: ${type}`,
				`body: ${io}`,
				isRequired,
				dependencies,
				refs,
			);
		}),
	);
};

const serializeQueryParameterObjects = (
	from: Ref,
	parameters: NonEmptyArray<QueryParameterObject>,
): Either<Error, SerializedParameter> => {
	const serializedParameters = traverseArrayEither(parameters, parameter => {
		const required = isRequired(parameter);
		return pipe(
			serializeParameterObject(from, parameter),
			either.map(getSerializedPropertyType(parameter.name, required)),
			either.map(fromSerializedType(required)),
		);
	});
	return pipe(
		serializedParameters,
		either.map(serializedParameters => {
			const intercalated = intercalateSerializedParameters(
				serializedParameter(';', ',', false, [], []),
				serializedParameters,
			);
			return pipe(
				intercalated,
				getSerializedObjectType(),
				parameter => {
					const { dependencies, refs, io, type } = parameter;

					return serializedParameter(
						`query${unless(intercalated.isRequired, '?')}: ${type}`,
						`query: ${io}`,
						intercalated.isRequired,
						dependencies,
						refs,
					);
				},
			);
		}),
	);
};
