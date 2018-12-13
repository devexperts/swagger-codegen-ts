import {
	TAllOfSchemaObject,
	TBodyParameterObject,
	TDefinitionsObject,
	TNonArrayItemsObject,
	TOperationObject,
	TParametersDefinitionsObject,
	TPathItemObject,
	TPathParameterObject,
	TPathsObject,
	TQueryParameterObject,
	TReferenceSchemaObject,
	TResponseObject,
	TResponsesObject,
	TSchemaObject,
	TSwaggerObject,
} from '../swagger';
import { directory, file, TDirectory, TFile } from '../fs';
import * as path from 'path';
import { array, catOptions, flatten, head, uniq } from 'fp-ts/lib/Array';
import { getRecordSetoid, Setoid, setoidString } from 'fp-ts/lib/Setoid';
import { fromArray, groupBy, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	getOperationParametersInBody,
	getOperationParametersInPath,
	getOperationParametersInQuery,
	groupPathsByTag,
	TSerializer,
} from '../utils';
import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { getArrayMonoid, getRecordMonoid, monoidString, fold, monoidAny } from 'fp-ts/lib/Monoid';
import { decapitalize } from '@devexperts/utils/dist/string/string';
import { intercalate } from 'fp-ts/lib/Foldable2v';
import { collect, lookup } from 'fp-ts/lib/Record';
import { identity } from 'fp-ts/lib/function';

const EMPTY_DEPENDENCIES: TDependency[] = [];
const EMPTY_REFS: string[] = [];
const SUCCESSFUL_CODES = ['200', 'default'];

const concatIfL = <A>(condition: boolean, as: A[], a: (as: A[]) => A[]): A[] => (condition ? as.concat(a(as)) : as);
const concatIf = <A>(condition: boolean, as: A[], a: A[]): A[] => concatIfL(condition, as, as => a);
const unless = (condition: boolean, a: string): string => (condition ? '' : a);
const when = (condition: boolean, a: string): string => (condition ? a : '');

type TDependency = {
	name: string;
	path: string;
};
type TSerializedType = {
	type: string;
	io: string;
	dependencies: TDependency[];
	refs: string[];
};
const serializedType = (type: string, io: string, dependencies: TDependency[], refs: string[]): TSerializedType => ({
	type,
	io,
	dependencies,
	refs,
});

type TSerializedParameter = TSerializedType & {
	isRequired: boolean;
};
const serializedParameter = (
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: TDependency[],
	refs: string[],
): TSerializedParameter => ({
	type,
	io,
	isRequired,
	dependencies,
	refs,
});
type TSerializedPathParameter = TSerializedParameter & {
	name: string;
};
const serializedPathParameter = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: TDependency[],
	refs: string[],
): TSerializedPathParameter => ({
	name,
	type,
	io,
	isRequired,
	dependencies,
	refs,
});
const dependency = (name: string, path: string): TDependency => ({
	name,
	path,
});
const dependencyOption = dependency('Option', 'fp-ts/lib/Option');
const dependencyCreateOptionFromNullable = dependency('createOptionFromNullable', 'io-ts-types');
const OPTION_DEPENDENCIES: TDependency[] = [dependencyOption, dependencyCreateOptionFromNullable];

const monoidDependencies = getArrayMonoid<TDependency>();
const monoidRefs = getArrayMonoid<string>();
const monoidSerializedType = getRecordMonoid<TSerializedType>({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	refs: monoidRefs,
});
const monoidSerializedParameter = getRecordMonoid<TSerializedParameter>({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	isRequired: monoidAny,
	refs: monoidRefs,
});
const setoidSerializedTypeWithoutDependencies: Setoid<TSerializedType> = getRecordSetoid<
	Pick<TSerializedType, 'type' | 'io'>
>({
	type: setoidString,
	io: setoidString,
});
const foldSerialized = fold(monoidSerializedType);
const intercalateSerialized = intercalate(monoidSerializedType, array);
const intercalateSerializedParameter = intercalate(monoidSerializedParameter, array);
const uniqString = uniq(setoidString);
const uniqSerializedWithoutDependencies = uniq(setoidSerializedTypeWithoutDependencies);

const ROOT_DIRECTORY = '.';
const CONTROLLERS_DIRECTORY = 'controllers';
const DEFINITIONS_DIRECTORY = 'definitions';
const CLIENT_DIRECTORY = 'client';
const CLIENT_FILENAME = 'client';
const UTILS_DIRECTORY = 'utils';
const UTILS_FILENAME = 'utils';

const getRelativeRoot = (cwd: string) => path.relative(cwd, ROOT_DIRECTORY);
const getRelativeRefPath = (cwd: string, refBlockName: string, refFileName: string): string =>
	`${getRelativeRoot(cwd)}/${refBlockName}/${refFileName}`;
const getRelativeOutRefPath = (cwd: string, blockName: string, outFileName: string, refFileName: string): string =>
	`${getRelativeRoot(cwd)}/../${outFileName}/${blockName}/${refFileName}`;
const getRelativeClientPath = (cwd: string): string => `${getRelativeRoot(cwd)}/${CLIENT_DIRECTORY}/${CLIENT_FILENAME}`;
const getRelativeUtilsPath = (cwd: string): string => `${getRelativeRoot(cwd)}/${UTILS_DIRECTORY}/${UTILS_FILENAME}`;

export const serialize: TSerializer = (name: string, swaggerObject: TSwaggerObject): TDirectory =>
	directory(name, [
		directory(CLIENT_DIRECTORY, [file(`${CLIENT_FILENAME}.ts`, client)]),
		directory(UTILS_DIRECTORY, [file(`${UTILS_FILENAME}.ts`, utils)]),
		...catOptions([swaggerObject.definitions.map(serializeDefinitions)]),
		serializePaths(swaggerObject.paths, swaggerObject.parameters),
	]);

const serializeDefinitions = (definitions: TDefinitionsObject): TDirectory =>
	directory(DEFINITIONS_DIRECTORY, [
		...serializeDictionary(definitions, (name, definition) =>
			serializeDefinition(name, definition, `${ROOT_DIRECTORY}/${DEFINITIONS_DIRECTORY}`),
		),
	]);
const serializePaths = (paths: TPathsObject, parameters: Option<TParametersDefinitionsObject>): TDirectory =>
	directory(
		CONTROLLERS_DIRECTORY,
		serializeDictionary(groupPathsByTag(paths, parameters), (name, group) =>
			serializePathGroup(name, group, `${ROOT_DIRECTORY}/${CONTROLLERS_DIRECTORY}`),
		),
	);

const serializeDefinition = (name: string, definition: TSchemaObject, cwd: string): TFile => {
	const serialized = serializeSchemaObject(definition, name, cwd);

	const dependencies = serializeDependencies(serialized.dependencies);

	return file(
		`${name}.ts`,
		`
			${dependencies}
			
			export type ${name} = ${serialized.type};
			export const ${getIOName(name)} = ${serialized.io};
		`,
	);
};

const serializePathGroup = (name: string, group: Record<string, TPathItemObject>, cwd: string): TFile => {
	const groupName = `${name}Controller`;
	const serialized = foldSerialized(
		serializeDictionary(group, (url, item) => serializePath(url, item, groupName, cwd)),
	);
	const dependencies = serializeDependencies([
		...serialized.dependencies,
		dependency('asks', 'fp-ts/lib/Reader'),
		dependency('TAPIClient', getRelativeClientPath(cwd)),
	]);
	return file(
		`${groupName}.ts`,
		`
			${dependencies}
		
			export type ${groupName} = {
				${serialized.type}
			};
			
			export const ${decapitalize(groupName)} = asks((e: { apiClient: TAPIClient }): ${groupName} => ({
				${serialized.io}
			}));
		`,
	);
};
const serializePath = (url: string, item: TPathItemObject, rootName: string, cwd: string): TSerializedType => {
	const get = item.get.map(operation => serializeOperationObject(url, 'GET', operation, rootName, cwd));
	const put = item.put.map(operation => serializeOperationObject(url, 'PUT', operation, rootName, cwd));
	const post = item.post.map(operation => serializeOperationObject(url, 'POST', operation, rootName, cwd));
	const remove = item.delete.map(operation => serializeOperationObject(url, 'DELETE', operation, rootName, cwd));
	const options = item.options.map(operation => serializeOperationObject(url, 'OPTIONS', operation, rootName, cwd));
	const head = item.head.map(operation => serializeOperationObject(url, 'HEAD', operation, rootName, cwd));
	const patch = item.patch.map(operation => serializeOperationObject(url, 'PATCH', operation, rootName, cwd));
	const operations = catOptions([get, put, post, remove, options, head, patch]);
	return foldSerialized(operations);
};

const is$ref = (a: TReferenceSchemaObject | TAllOfSchemaObject): a is TReferenceSchemaObject =>
	Object.prototype.hasOwnProperty.bind(a)('$ref');

const serializeSchemaObject = (schema: TSchemaObject, rootName: string, cwd: string): TSerializedType => {
	switch (schema.type) {
		case undefined: {
			if (is$ref(schema)) {
				const $ref = schema.$ref;
				const defBlock = fromNullable($ref.match(/#\/[^\/]+\//))
					.chain(head)
					.map(def => def.replace(/[#, \/]/g, ''));
				const refFileName = fromNullable($ref.match(/^\.\/[^\/]+\.[^\/]+#/))
					.chain(head)
					.map(ref => ref.replace(/(\.\/|\.[^/]+#)/g, ''));
				const safeType = fromNullable($ref.match(/\/[^\/]+$/))
					.chain(head)
					.map(type => type.replace(/^\//, ''));

				if (safeType.isNone() || defBlock.isNone()) {
					throw new Error(`Invalid $ref: ${$ref}`);
				}

				const type = safeType.value;

				const io = getIOName(type);
				const isRecursive = rootName === type || rootName === io;
				const definitionFilePath = refFileName.isSome()
					? getRelativeOutRefPath(cwd, defBlock.value, refFileName.value, type)
					: getRelativeRefPath(cwd, defBlock.value, type);

				return serializedType(
					type,
					io,
					isRecursive
						? EMPTY_DEPENDENCIES
						: [dependency(type, definitionFilePath), dependency(io, definitionFilePath)],
					[type],
				);
			}

			const results = schema.allOf.map(item => serializeSchemaObject(item, rootName, cwd));
			const types = results.map(item => item.type);
			const ios = results.map(item => item.io);
			const dependencies = fold(monoidDependencies)(results.map(item => item.dependencies));
			const refs = fold(monoidRefs)(results.map(item => item.refs));

			return serializedType(
				intercalate(monoidString, array)(' & ', types),
				`intersection([${intercalate(monoidString, array)(', ', ios)}])`,
				[dependency('intersection', 'io-ts'), ...dependencies],
				refs,
			);
		}
		case 'string': {
			return schema.enum
				.map(serializeEnum)
				.orElse(() =>
					schema.format.chain(format => {
						switch (format) {
							case 'date-time': {
								return some(
									serializedType(
										'Date',
										'DateFromISOString',
										[dependency('DateFromISOString', 'io-ts-types')],
										EMPTY_REFS,
									),
								);
							}
						}
						return none;
					}),
				)
				.getOrElseL(() => serializedType('string', 'string', [dependency('string', 'io-ts')], EMPTY_REFS));
		}
		case 'boolean': {
			return serializedType('boolean', 'boolean', [dependency('boolean', 'io-ts')], EMPTY_REFS);
		}
		case 'integer':
		case 'number': {
			return serializedType('number', 'number', [dependency('number', 'io-ts')], EMPTY_REFS);
		}
		case 'array': {
			const result = serializeSchemaObject(schema.items, rootName, cwd);
			return serializedType(
				`Array<${result.type}>`,
				`array(${result.io})`,
				[...result.dependencies, dependency('array', 'io-ts')],
				result.refs,
			);
		}
		case 'object': {
			return schema.additionalProperties
				.map(additionalProperties => serializeAdditionalProperties(additionalProperties, rootName, cwd))
				.orElse(() =>
					schema.properties.map(properties => {
						const serialized = foldSerialized(
							serializeDictionary(properties, (name, value) => {
								const isRequired = schema.required
									.map(required => required.includes(name))
									.getOrElse(false);
								const field = serializeSchemaObject(value, rootName, cwd);
								const type = isRequired ? `${name}: ${field.type}` : `${name}: Option<${field.type}>`;
								const io = isRequired
									? `${name}: ${field.io}`
									: `${name}: createOptionFromNullable(${field.io})`;
								return serializedType(
									`${type};`,
									`${io},`,
									concatIf(!isRequired, field.dependencies, OPTION_DEPENDENCIES),
									field.refs,
								);
							}),
						);
						return toObjectType(serialized, serialized.refs.includes(rootName) ? some(rootName) : none);
					}),
				)
				.getOrElseL(() =>
					serializedType(
						'unknown',
						'unknownType',
						[dependency('unknownType', getRelativeUtilsPath(cwd))],
						EMPTY_REFS,
					),
				);
		}
	}
};

const serializeEnum = (enumValue: Array<string | number | boolean>): TSerializedType => {
	const type = enumValue.map(value => `'${value}'`).join(' | ');
	const io = `union([${enumValue.map(value => `literal('${value}')`).join(',')}])`;
	return serializedType(type, io, [dependency('union', 'io-ts'), dependency('literal', 'io-ts')], EMPTY_REFS);
};

const serializeAdditionalProperties = (properties: TSchemaObject, rootName: string, cwd: string): TSerializedType => {
	const additional = serializeSchemaObject(properties, rootName, cwd);
	return serializedType(
		`{ [key: string]: ${additional.type} }`,
		`dictionary(string, ${additional.io})`,
		[...additional.dependencies, dependency('string', 'io-ts'), dependency('dictionary', 'io-ts')],
		additional.refs,
	);
};

const serializeOperationObject = (
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
	operation: TOperationObject,
	rootName: string,
	cwd: string,
): TSerializedType => {
	const pathParameters = getOperationParametersInPath(operation);
	const queryParameters = getOperationParametersInQuery(operation);
	const bodyParameters = getOperationParametersInBody(operation);

	const pathParamsSummary = pathParameters.map(serializePathParameterDescription);
	const paramsSummary = serializeParametersDescription(queryParameters, bodyParameters);

	const deprecated = operation.deprecated.map(deprecated => `@deprecated`);
	const jsdoc = serializeJSDOC(
		catOptions([deprecated, operation.summary, ...pathParamsSummary.map(some), paramsSummary]),
	);

	const serializedPathParameters = pathParameters.map(serializePathParameter);

	const serializedResponses = serializeOperationResponses(operation.responses, rootName, cwd);

	const operationName = getOperationName(operation, method);

	const serializedUrl = serializeURL(url, serializedPathParameters);

	const serializedQueryParameters = fromArray(queryParameters).map(queryParameters =>
		serializeQueryParameters(queryParameters),
	);
	const serializedBodyParameters = fromArray(bodyParameters).map(bodyParameters =>
		serializeBodyParameters(bodyParameters, rootName, cwd),
	);

	const serializedParameters = intercalateSerializedParameter(
		serializedParameter(',', ',', false, EMPTY_DEPENDENCIES, EMPTY_REFS),
		catOptions([serializedQueryParameters, serializedBodyParameters]),
	);

	const hasQueryParameters = queryParameters.length > 0;
	const hasBodyParameters = bodyParameters.length > 0;
	const hasParameters = hasQueryParameters || hasBodyParameters;

	const argsName = concatIf(hasParameters, pathParameters.map(p => p.name), ['parameters']).join(',');
	const argsType = concatIfL(hasParameters, serializedPathParameters.map(p => p.type), () => [
		`parameters: { ${serializedParameters.type} }`,
	]).join(',');

	const type = `
		${jsdoc}
		readonly ${operationName}: (${argsType}) => LiveData<Error, ${serializedResponses.type}>;
	`;

	const io = `
		${operationName}: (${argsName}) => {
			${when(hasParameters, `const encoded = partial({ ${serializedParameters.io} }).encode(parameters);`)}
	
			return e.apiClient.request({
				url: ${serializedUrl},
				method: '${method}',
				${when(hasQueryParameters, 'query: encoded.query,')}
				${when(hasBodyParameters, 'body: encoded.body,')}
			}).pipe(map(data => data.chain(value => fromEither(${
				serializedResponses.io
			}.decode(value).mapLeft(ResponseValiationError.create)))))
		},
	`;

	const dependencies = concatIfL(
		hasParameters,
		[
			dependency('map', 'rxjs/operators'),
			dependency('fromEither', '@devexperts/remote-data-ts'),
			dependency('ResponseValiationError', getRelativeClientPath(cwd)),
			dependency('LiveData', '@devexperts/rx-utils/dist/rd/live-data.utils'),
			...flatten(serializedPathParameters.map(parameter => parameter.dependencies)),
			...serializedResponses.dependencies,
			...serializedParameters.dependencies,
		],
		() => [dependency('partial', 'io-ts')],
	);

	return serializedType(type, io, dependencies, serializedParameters.refs);
};

const serializeOperationResponses = (responses: TResponsesObject, rootName: string, cwd: string): TSerializedType => {
	const serializedResponses = uniqSerializedWithoutDependencies(
		catOptions(
			SUCCESSFUL_CODES.map(code =>
				lookup(code, responses).chain(response => serializeOperationResponse(code, response, rootName, cwd)),
			),
		),
	);
	if (serializedResponses.length === 0) {
		return serializedType('void', 'tvoid', [dependency('void as tvoid', 'io-ts')], EMPTY_REFS);
	}
	const combined = intercalateSerialized(
		serializedType('|', ',', EMPTY_DEPENDENCIES, EMPTY_REFS),
		serializedResponses,
	);

	const isUnion = serializedResponses.length > 1;

	return serializedType(
		combined.type,
		isUnion ? `union([${combined.io}])` : combined.io,
		concatIfL(isUnion, combined.dependencies, () => [dependency('union', 'io-ts')]),
		EMPTY_REFS,
	);
};

const serializeOperationResponse = (
	code: string,
	response: TResponseObject,
	rootName: string,
	cwd: string,
): Option<TSerializedType> => response.schema.map(schema => serializeSchemaObject(schema, rootName, cwd));

const serializePathParameter = (parameter: TPathParameterObject): TSerializedPathParameter => {
	const serializedParameterType = serializeParameter(parameter);

	return serializedPathParameter(
		parameter.name,
		`${parameter.name}: ${serializedParameterType.type}`,
		`${serializedParameterType.io}.encode(${parameter.name})`,
		true,
		serializedParameterType.dependencies,
		serializedParameterType.refs,
	);
};

const serializePathParameterDescription = (parameter: TPathParameterObject): string =>
	`@param { ${serializeParameter(parameter).type} } ${parameter.name} ${parameter.description
		.map(d => '- ' + d)
		.toUndefined()}`;

const serializeQueryParameter = (parameter: TQueryParameterObject): TSerializedParameter => {
	const isRequired = parameter.required.getOrElse(false);
	const serializedParameterType = serializeParameter(parameter);
	const serializedRequired = serializeRequired(
		parameter.name,
		serializedParameterType.type,
		serializedParameterType.io,
		isRequired,
	);

	return serializedParameter(
		serializedRequired.type,
		serializedRequired.io,
		serializedParameterType.isRequired || isRequired,
		[...serializedParameterType.dependencies, ...serializedRequired.dependencies],
		serializedRequired.refs,
	);
};

const serializeQueryParameters = (parameters: NonEmptyArray<TQueryParameterObject>): TSerializedParameter => {
	const serializedParameters = parameters.toArray().map(serializeQueryParameter);
	const intercalated = intercalateSerializedParameter(
		serializedParameter(';', ',', false, EMPTY_DEPENDENCIES, EMPTY_REFS),
		serializedParameters,
	);
	const { isRequired, dependencies, refs, io, type } = intercalated;
	return serializedParameter(
		`query${unless(isRequired, '?')}: { ${type} }`,
		`query: type({ ${io} })`,
		intercalated.isRequired,
		[...dependencies, dependency('type', 'io-ts')],
		refs,
	);
};

const serializeBodyParameter = (
	parameter: TBodyParameterObject,
	rootName: string,
	cwd: string,
): TSerializedParameter => {
	const isRequired = parameter.required.getOrElse(false);
	const serializedParameterType = serializeSchemaObject(parameter.schema, rootName, cwd);
	return serializedParameter(
		serializedParameterType.type,
		serializedParameterType.io,
		isRequired,
		serializedParameterType.dependencies,
		serializedParameterType.refs,
	);
};
const serializeBodyParameters = (
	parameters: NonEmptyArray<TBodyParameterObject>,
	rootName: string,
	cwd: string,
): TSerializedParameter => {
	// according to spec there can be only one body parameter
	const serializedBodyParameter = serializeBodyParameter(parameters.head, rootName, cwd);
	const { type, isRequired, io, dependencies, refs } = serializedBodyParameter;
	return serializedParameter(
		`body${unless(isRequired, '?')}: ${type}`,
		`body: ${io}`,
		isRequired,
		dependencies,
		refs,
	);
};

const serializeParametersDescription = (
	query: TQueryParameterObject[],
	body: TBodyParameterObject[],
): Option<string> => {
	const parameters = [...query, ...body];
	return parameters.length === 0
		? none
		: some(hasRequiredParameters(parameters) ? '@param { object } parameters' : '@param { object } [parameters]');
};

const serializeParameter = (parameter: TPathParameterObject | TQueryParameterObject): TSerializedParameter => {
	const isRequired =
		typeof parameter.required === 'boolean' ? parameter.required : parameter.required.getOrElse(false);
	switch (parameter.type) {
		case 'array': {
			const serializedArrayItems = serializeNonArrayItemsObject(parameter.items);
			return serializedParameter(
				`Array<${serializedArrayItems.type}>`,
				`array(${serializedArrayItems.io})`,
				isRequired,
				[...serializedArrayItems.dependencies, dependency('array', 'io-ts')],
				serializedArrayItems.refs,
			);
		}
		case 'string': {
			return serializedParameter('string', 'string', isRequired, [dependency('string', 'io-ts')], EMPTY_REFS);
		}
		case 'boolean': {
			return serializedParameter('boolean', 'boolean', isRequired, [dependency('boolean', 'io-ts')], EMPTY_REFS);
		}
		case 'integer':
		case 'number': {
			return serializedParameter('number', 'number', isRequired, [dependency('number', 'io-ts')], EMPTY_REFS);
		}
	}
};

const serializeNonArrayItemsObject = (items: TNonArrayItemsObject): TSerializedType => {
	switch (items.type) {
		case 'string': {
			return serializedType('string', 'string', [dependency('string', 'io-ts')], EMPTY_REFS);
		}
		case 'boolean': {
			return serializedType('boolean', 'boolean', [dependency('boolean', 'io-ts')], EMPTY_REFS);
		}
		case 'integer':
		case 'number': {
			return serializedType('number', 'number', [dependency('number', 'io-ts')], EMPTY_REFS);
		}
	}
};

const serializeDictionary = <A, B>(dictionary: Record<string, A>, serializeValue: (name: string, value: A) => B): B[] =>
	Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));

const getIOName = (name: string): string => `${name}IO`;
const getOperationName = (operation: TOperationObject, httpMethod: string) =>
	operation.operationId.getOrElse(httpMethod);

const serializeDependencies = (dependencies: TDependency[]): string =>
	collect(groupBy(dependencies, dependency => dependency.path), (key, dependencies) => {
		const names = uniqString(dependencies.toArray().map(dependency => dependency.name));
		return `import { ${names.join(',')} } from '${dependencies.head.path}';`;
	}).join('');

const client = `
	import { LiveData } from '@devexperts/rx-utils/dist/rd/live-data.utils';
	import { Errors, mixed } from 'io-ts';

	export type TAPIRequest = {
		url: string;
		query?: object;
		body?: unknown;
	};

	export type TFullAPIRequest = TAPIRequest & {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	};
	
	export type TAPIClient = {
		readonly request: (request: TFullAPIRequest) => LiveData<Error, mixed>;
	};
	
	export class ResponseValiationError extends Error {
		static create(errors: Errors): ResponseValiationError {
			return new ResponseValiationError(errors);
		} 
	
		constructor(readonly errors: Errors) {
			super('ResponseValiationError');
			Object.setPrototypeOf(this, ResponseValiationError);
		}
	}
`;

const utils = `
	import { Type, success, identity } from 'io-ts';
	export const unknownType = new class UnknownType extends Type<unknown> {
		readonly _tag: 'UnknownType' = 'UnknownType';
	
		constructor() {
			super('unknownType', (_: unknown): _ is unknown => true, success, identity);
		}
	}();
`;

const hasRequiredParameters = (parameters: Array<TQueryParameterObject | TBodyParameterObject>): boolean =>
	parameters.some(p => p.required.exists(identity));

const serializeRequired = (name: string, type: string, io: string, isRequired: boolean): TSerializedType =>
	isRequired
		? serializedType(`${name}: ${type}`, `${name}: ${io}`, EMPTY_DEPENDENCIES, EMPTY_REFS)
		: serializedType(
				`${name}: Option<${type}>`,
				`${name}: createOptionFromNullable(${io})`,
				OPTION_DEPENDENCIES,
				EMPTY_REFS,
		  );

const serializeJSDOC = (lines: string[]): string =>
	unless(
		lines.length === 0,
		`/**
	 ${lines.map(line => `* ${line}`).join('\n')}
	 */`,
	);

const serializeURL = (url: string, pathParameters: TSerializedPathParameter[]): string =>
	pathParameters.reduce(
		(acc, p) => acc.replace(`{${p.name}}`, `\$\{encodeURIComponent(${p.io}.toString())\}`),
		`\`${url}\``,
	);

const toObjectType = (serialized: TSerializedType, recursion: Option<string>): TSerializedType => {
	const io = `type({ ${serialized.io} })`;
	return serializedType(
		`{ ${serialized.type} }`,
		recursion
			.map(recursion => {
				const recursionIO = getIOName(recursion);
				return `recursion<${recursion}, unknown>('${recursionIO}', ${recursionIO} => ${io})`;
			})
			.getOrElse(io),
		concatIfL(recursion.isSome(), [...serialized.dependencies, dependency('type', 'io-ts')], () => [
			dependency('recursion', 'io-ts'),
		]),
		EMPTY_REFS,
	);
};
