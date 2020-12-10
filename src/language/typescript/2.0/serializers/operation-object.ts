import { OperationObject } from '../../../../schema/2.0/operation-object';
import {
	getSerializedObjectType,
	getSerializedOptionalType,
	getSerializedPropertyType,
	getSerializedRefType,
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { getOrElse, isSome, map, Option, fold } from 'fp-ts/lib/Option';
import { serializeOperationResponses } from './responses-object';
import { fromSerializedType } from '../../common/data/serialized-parameter';
import { getSerializedKindDependency, serializedDependency } from '../../common/data/serialized-dependency';
import { concatIf } from '../../../../utils/array';
import { when } from '../../../../utils/string';
import { getJSDoc, getKindValue, getSafePropertyName, getURL, HTTPMethod, XHRResponseType } from '../../common/utils';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { array, either, nonEmptyArray, option, record } from 'fp-ts';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { ResolveRefContext, fromString, getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/bundled/client';
import {
	ArrayParameterObjectCollectionFormat,
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
import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { eqString, getStructEq } from 'fp-ts/lib/Eq';
import { Kind } from '../../../../utils/types';
import {
	combineFragmentsK,
	getSerializedOptionCallFragment,
	intercalateSerializedFragmentsNEA,
	serializedFragment,
	SerializedFragment,
} from '../../common/data/serialized-fragment';
import { sequenceOptionEither } from '../../../../utils/option';
import { identity } from 'fp-ts/lib/function';

interface Parameters {
	readonly pathParameters: PathParameterObject[];
	readonly serializedPathParameters: SerializedPathParameter[];
	readonly serializedQueryParameter: Option<SerializedType>;
	readonly serializedBodyParameter: Option<SerializedType>;
	readonly headerParameters: HeaderParameterObject[];
	readonly formDataParameters: FormDataParameterObject[];
	readonly queryString: Option<SerializedFragment>;
}

const contains = array.elem(
	getStructEq({
		name: eqString,
		in: eqString,
	}),
);

const getParameters = combineReader(
	ask<ResolveRefContext>(),
	e => (from: Ref, operation: OperationObject, pathItem: PathItemObject): Either<Error, Parameters> => {
		const processedParameters: ParameterObject[] = [];
		const pathParameters: PathParameterObject[] = [];
		const serializedPathParameters: SerializedPathParameter[] = [];
		const serializedQueryParameters: SerializedType[] = [];
		const bodyParameters: BodyParameterObject[] = [];
		const headerParameters: HeaderParameterObject[] = [];
		const formDataParameters: FormDataParameterObject[] = [];
		const queryStringFragments: SerializedFragment[] = [];

		const parameters = pipe(
			// note that PathItem parameters should go after OperationObject parameters because they have lower priority
			// this means that OperationObject can override PathItemObject parameters
			[operation.parameters, pathItem.parameters],
			array.compact,
			array.flatten,
		);

		for (const parameter of parameters) {
			const resolved = ReferenceObjectCodec.is(parameter)
				? pipe(
						e.resolveRef(parameter.$ref, ParameterObjectCodec),
						either.mapLeft(() => new Error(`Unable to resolve parameter with $ref "${parameter.$ref}"`)),
				  )
				: right(parameter);

			if (isLeft(resolved)) {
				return resolved;
			}

			// if parameter has already been processed then skip it
			if (contains(resolved.right, processedParameters)) {
				continue;
			}
			processedParameters.push(resolved.right);

			const required = isRequired(resolved.right);

			const serialized = ReferenceObjectCodec.is(parameter)
				? pipe(
						fromString(parameter.$ref),
						either.map(getSerializedRefType(from)),
						either.map(fromSerializedType(required)),
				  )
				: serializeParameterObject(from, resolved.right);

			if (isLeft(serialized)) {
				return serialized;
			}

			switch (resolved.right.in) {
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
					break;
				}
				case 'path': {
					pathParameters.push(resolved.right);

					const serializedParameter = pipe(
						serialized.right,
						fromSerializedParameter(resolved.right.name),
						getSerializedPathParameterType,
					);

					serializedPathParameters.push(serializedParameter);
					break;
				}
				case 'query': {
					const serializedParameter = getSerializedOptionalType(required, serialized.right);

					const queryStringFragment = serializeQueryParameterObject(
						from,
						resolved.right,
						serializedParameter,
						'parameters.query',
					);

					if (isLeft(queryStringFragment)) {
						return queryStringFragment;
					}

					queryStringFragments.push(queryStringFragment.right);

					serializedQueryParameters.push(
						getSerializedPropertyType(resolved.right.name, true, serializedParameter),
					);
					break;
				}
			}
		}

		const serializedQueryParameter = pipe(
			nonEmptyArray.fromArray(serializedQueryParameters),
			option.map(parameters =>
				pipe(
					intercalateSerializedTypes(serializedType(';', ',', [], []), parameters),
					getSerializedObjectType(),
				),
			),
		);

		// according to spec there can be only one body parameter
		const serializedBodyParameter = pipe(
			array.head(bodyParameters),
			option.map(parameter => {
				const required = isRequired(parameter);
				return pipe(
					serializeSchemaObject(from, parameter.schema),
					either.map(serialized => getSerializedOptionalType(required, serialized)),
				);
			}),
			sequenceOptionEither,
		);

		const queryString = pipe(
			nonEmptyArray.fromArray(queryStringFragments),
			option.map(queryStringFragments =>
				intercalateSerializedFragmentsNEA(serializedFragment(',', [], []), queryStringFragments),
			),
			option.map(f =>
				combineFragmentsK(f, c =>
					serializedFragment(
						`compact([${c}]).join('&')`,
						[serializedDependency('compact', 'fp-ts/lib/Array')],
						[],
					),
				),
			),
		);
		return combineEither(serializedBodyParameter, serializedBodyParameter => ({
			pathParameters,
			serializedPathParameters,
			serializedQueryParameter,
			serializedBodyParameter,
			headerParameters,
			formDataParameters,
			queryString,
		}));
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
		const operationName = getOperationName(url, operation, method);

		const isSuccessResponse = (code: string) => {
			const status = parseInt(code, 10);
			return status >= 200 && status < 300;
		};

		const serializedResponses = serializeOperationResponses(
			from,
			pipe(operation.responses, record.filterWithIndex(isSuccessResponse)),
		);

		const deprecated = pipe(
			operation.deprecated,
			option.filter(identity),
			map(() => `@deprecated`),
		);

		const responseType: XHRResponseType = pipe(
			operation.produces,
			fold(
				() => 'json',
				produces => {
					if (produces.includes('application/octet-stream')) {
						return 'blob';
					}
					if (produces.includes('text/plain')) {
						return 'text';
					}
					return 'json';
				},
			),
		);

		return combineEither(
			parameters,
			serializedResponses,
			clientRef,
			(parameters, serializedResponses, clientRef) => {
				const hasQueryParameters = isSome(parameters.serializedQueryParameter);
				const hasBodyParameters = isSome(parameters.serializedBodyParameter);
				const hasParameters = hasQueryParameters || hasBodyParameters;

				const bodyType = pipe(
					parameters.serializedBodyParameter,
					option.map(body => `body: ${body.type},`),
					option.getOrElse(() => ''),
				);
				const bodyIO = pipe(
					parameters.serializedBodyParameter,
					option.map(body => `const body = ${body.io}.encode(parameters.body);`),
					option.getOrElse(() => ''),
				);

				const queryType = pipe(
					parameters.serializedQueryParameter,
					option.map(query => `query: ${query.type},`),
					option.getOrElse(() => ''),
				);
				const queryIO = pipe(
					parameters.queryString,
					option.map(query => `const query = ${query.value};`),
					option.getOrElse(() => ''),
				);

				const argsType = concatIf(
					hasParameters,
					parameters.serializedPathParameters.map(p => p.type),
					[`parameters: { ${queryType}${bodyType} }`],
				).join(',');

				const type = `
					${getJSDoc(array.compact([deprecated, operation.summary]))}
					readonly ${operationName}: (${argsType}) => ${getKindValue(kind, serializedResponses.type)};
				`;

				const argsIO = concatIf(
					hasParameters,
					parameters.pathParameters.map(p => p.name),
					['parameters'],
				).join(',');

				const io = `
					${operationName}: (${argsIO}) => {
						${bodyIO}
						${queryIO}

						return e.httpClient.chain(
							e.httpClient.request({
								url: ${getURL(url, parameters.serializedPathParameters)},
								method: '${method}',
								responseType: '${responseType}',
								${when(hasQueryParameters, 'query,')}
								${when(hasBodyParameters, 'body,')}
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

				const dependencies = [
					serializedDependency('ResponseValidationError', getRelativePath(from, clientRef)),
					serializedDependency('pipe', 'fp-ts/lib/pipeable'),
					serializedDependency('either', 'fp-ts'),
					getSerializedKindDependency(kind),
					...serializedResponses.dependencies,
					...array.flatten([
						...parameters.serializedPathParameters.map(p => p.dependencies),
						...array.compact([
							pipe(
								parameters.serializedQueryParameter,
								option.map(p => p.dependencies),
							),
							pipe(
								parameters.serializedBodyParameter,
								option.map(p => p.dependencies),
							),
							pipe(
								parameters.queryString,
								option.map(p => p.dependencies),
							),
						]),
					]),
				];

				const refs = array.flatten([
					...parameters.serializedPathParameters.map(p => p.refs),
					...array.compact([
						pipe(
							parameters.serializedQueryParameter,
							option.map(p => p.refs),
						),
						pipe(
							parameters.serializedBodyParameter,
							option.map(p => p.refs),
						),
						pipe(
							parameters.queryString,
							option.map(p => p.refs),
						),
					]),
					...parameters.serializedPathParameters.map(p => p.refs),
				]);

				return serializedType(type, io, dependencies, refs);
			},
		);
	},
);

const getOperationName = (url: string, operation: OperationObject, httpMethod: string) =>
	pipe(
		operation.operationId,
		getOrElse(() => `${httpMethod}_${getSafePropertyName(url)}`),
	);

export const getCollectionSeparator = (format: 'csv' | 'ssv' | 'tsv' | 'pipes'): string => {
	switch (format) {
		case 'csv': {
			return ',';
		}
		case 'ssv': {
			return ' ';
		}
		case 'tsv': {
			return '\t';
		}
		case 'pipes': {
			return '|';
		}
	}
};

export const serializeQueryParameterObject = (
	from: Ref,
	parameter: QueryParameterObject,
	serialized: SerializedType,
	target: string,
): Either<Error, SerializedFragment> => {
	const required = isRequired(parameter);
	const encoded = serializedFragment(
		`${serialized.io}.encode(${target}.${parameter.name})`,
		serialized.dependencies,
		serialized.refs,
	);

	switch (parameter.type) {
		case 'string':
		case 'integer':
		case 'number':
		case 'boolean': {
			const f = serializedFragment(
				`value => some(encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(value))`,
				[serializedDependency('some', 'fp-ts/lib/Option')],
				[],
			);
			return right(getSerializedOptionCallFragment(!required, f, encoded));
		}
		case 'array': {
			const collectionFormat: ArrayParameterObjectCollectionFormat = pipe(
				parameter.collectionFormat,
				option.getOrElse<ArrayParameterObjectCollectionFormat>(() => 'csv'),
			);

			switch (collectionFormat) {
				case 'csv':
				case 'ssv':
				case 'tsv':
				case 'pipes': {
					const s = getCollectionSeparator(collectionFormat);
					const f = serializedFragment(
						`value => some(encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(value.join('${s}')))`,
						[serializedDependency('some', 'fp-ts/lib/Option')],
						[],
					);
					return right(getSerializedOptionCallFragment(!required, f, encoded));
				}
				case 'multi': {
					const f = serializedFragment(
						`value => some(value.map(item => encodeURIComponent('${parameter.name}') + '=' + encodeURIComponent(item)).join('&'))`,
						[serializedDependency('some', 'fp-ts/lib/Option')],
						[],
					);
					return right(getSerializedOptionCallFragment(!required, f, encoded));
				}
			}

			return left(new Error('Invalid ArrayQueryParameterObject'));
		}
	}
};
