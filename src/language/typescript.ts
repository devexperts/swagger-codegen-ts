import {
	AllOfSchemaObject,
	BodyParameterObject,
	DefinitionsObject,
	NonArrayItemsObject,
	OperationObject,
	ParametersDefinitionsObject,
	PathItemObject,
	PathParameterObject,
	PathsObject,
	QueryParameterObject,
	ReferenceSchemaObject,
	ResponseObject,
	ResponsesObject,
	SchemaObject,
	SwaggerObject,
} from '../schema/2.0/swagger';
import { directory, file, Directory, File } from '../fs';
import * as path from 'path';
import { array, flatten, getMonoid as getArrayMonoid, uniq } from 'fp-ts/lib/Array';
import { fromArray, groupBy, head, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import {
	getOperationParametersInBody,
	getOperationParametersInPath,
	getOperationParametersInQuery,
	groupPathsByTag,
	Serializer,
} from '../utils';
import {
	fromNullable,
	getOrElse,
	isNone,
	isSome,
	map,
	mapNullable,
	none,
	Option,
	some,
	alt,
	chain,
	toUndefined,
	exists,
} from 'fp-ts/lib/Option';
import { monoidString, fold, monoidAny, getStructMonoid } from 'fp-ts/lib/Monoid';
import { decapitalize, camelize } from '@devexperts/utils/dist/string/string';
import { collect, lookup } from 'fp-ts/lib/Record';
import { constFalse, identity } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { intercalate } from 'fp-ts/lib/Foldable';

const EMPTY_DEPENDENCIES: Dependency[] = [];
const EMPTY_REFS: string[] = [];
const SUCCESSFUL_CODES = ['200', '201', 'default'];

const concatIfL = <A>(condition: boolean, as: A[], a: (as: A[]) => A[]): A[] => (condition ? as.concat(a(as)) : as);
const concatIf = <A>(condition: boolean, as: A[], a: A[]): A[] => concatIfL(condition, as, as => a);
const unless = (condition: boolean, a: string): string => (condition ? '' : a);
const when = (condition: boolean, a: string): string => (condition ? a : '');

type Dependency = {
	name: string;
	path: string;
};
type SerializedType = {
	type: string;
	io: string;
	dependencies: Dependency[];
	refs: string[];
};
const serializedType = (type: string, io: string, dependencies: Dependency[], refs: string[]): SerializedType => ({
	type,
	io,
	dependencies,
	refs,
});

type SerializedParameter = SerializedType & {
	isRequired: boolean;
};
const serializedParameter = (
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: Dependency[],
	refs: string[],
): SerializedParameter => ({
	type,
	io,
	isRequired,
	dependencies,
	refs,
});
type SerializedPathParameter = SerializedParameter & {
	name: string;
};
const serializedPathParameter = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: Dependency[],
	refs: string[],
): SerializedPathParameter => ({
	name,
	type,
	io,
	isRequired,
	dependencies,
	refs,
});
const dependency = (name: string, path: string): Dependency => ({
	name,
	path,
});
const dependencyOption = dependency('Option', 'fp-ts/lib/Option');
const dependencyCreateOptionFromNullable = dependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable');
const OPTION_DEPENDENCIES: Dependency[] = [dependencyOption, dependencyCreateOptionFromNullable];

const monoidDependencies = getArrayMonoid<Dependency>();
const monoidRefs = getArrayMonoid<string>();

const monoidSerializedType = getStructMonoid<SerializedType>({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	refs: monoidRefs,
});
const monoidSerializedParameter = getStructMonoid<SerializedParameter>({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	isRequired: monoidAny,
	refs: monoidRefs,
});
const setoidSerializedTypeWithoutDependencies: Eq<SerializedType> = getStructEq<Pick<SerializedType, 'type' | 'io'>>({
	type: eqString,
	io: eqString,
});
const foldSerialized = fold(monoidSerializedType);
const intercalateSerialized = intercalate(monoidSerializedType, array);
const intercalateSerializedParameter = intercalate(monoidSerializedParameter, array);
const uniqString = uniq(eqString);
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

export const serialize: Serializer = (name: string, swaggerObject: SwaggerObject): Directory =>
	directory(name, [
		directory(CLIENT_DIRECTORY, [file(`${CLIENT_FILENAME}.ts`, client)]),
		directory(UTILS_DIRECTORY, [file(`${UTILS_FILENAME}.ts`, utils)]),
		...array.compact([
			pipe(
				swaggerObject.definitions,
				map(serializeDefinitions),
			),
		]),
		serializePaths(swaggerObject.paths, swaggerObject.parameters),
	]);

const serializeDefinitions = (definitions: DefinitionsObject): Directory =>
	directory(DEFINITIONS_DIRECTORY, [
		...serializeDictionary(definitions, (name, definition) =>
			serializeDefinition(name, definition, `${ROOT_DIRECTORY}/${DEFINITIONS_DIRECTORY}`),
		),
	]);
const serializePaths = (paths: PathsObject, parameters: Option<ParametersDefinitionsObject>): Directory =>
	directory(
		CONTROLLERS_DIRECTORY,
		serializeDictionary(groupPathsByTag(paths, parameters), (name, group) =>
			serializePathGroup(name, group, `${ROOT_DIRECTORY}/${CONTROLLERS_DIRECTORY}`),
		),
	);

const serializeDefinition = (name: string, definition: SchemaObject, cwd: string): File => {
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

const serializePathGroup = (name: string, group: Record<string, PathItemObject>, cwd: string): File => {
	const groupName = `${name}Controller`;
	const serialized = foldSerialized(
		serializeDictionary(group, (url, item) => serializePath(url, item, groupName, cwd)),
	);
	const dependencies = serializeDependencies([
		...serialized.dependencies,
		dependency('asks', 'fp-ts/lib/Reader'),
		dependency('APIClient', getRelativeClientPath(cwd)),
	]);
	return file(
		`${groupName}.ts`,
		`
			${dependencies}
		
			export type ${groupName} = {
				${serialized.type}
			};
			
			export const ${decapitalize(groupName)} = asks((e: { apiClient: APIClient }): ${groupName} => ({
				${serialized.io}
			}));
		`,
	);
};
const serializePath = (url: string, item: PathItemObject, rootName: string, cwd: string): SerializedType => {
	const get = pipe(
		item.get,
		map(operation => serializeOperationObject(url, 'GET', operation, rootName, cwd)),
	);
	const put = pipe(
		item.put,
		map(operation => serializeOperationObject(url, 'PUT', operation, rootName, cwd)),
	);
	const post = pipe(
		item.post,
		map(operation => serializeOperationObject(url, 'POST', operation, rootName, cwd)),
	);
	const remove = pipe(
		item.delete,
		map(operation => serializeOperationObject(url, 'DELETE', operation, rootName, cwd)),
	);
	const options = pipe(
		item.options,
		map(operation => serializeOperationObject(url, 'OPTIONS', operation, rootName, cwd)),
	);
	const head = pipe(
		item.head,
		map(operation => serializeOperationObject(url, 'HEAD', operation, rootName, cwd)),
	);
	const patch = pipe(
		item.patch,
		map(operation => serializeOperationObject(url, 'PATCH', operation, rootName, cwd)),
	);
	const operations = array.compact([get, put, post, remove, options, head, patch]);
	return foldSerialized(operations);
};

const is$ref = (a: ReferenceSchemaObject | AllOfSchemaObject): a is ReferenceSchemaObject =>
	Object.prototype.hasOwnProperty.bind(a)('$ref');
const getDefName = (name: string, prefix: string): string => `${camelize(prefix, true)}${name}`;
const getImportAsDef = (name: string, prefix: string): string => `${name} as ${getDefName(name, prefix)}`;
const isSameOutName = (isSameName: boolean, isOut: boolean): boolean => isOut && isSameName;
const getDefIFSameName = (isSameOutName: boolean, prefix: string) => (name: string): string =>
	!isSameOutName ? name : getDefName(name, prefix);
const importAsFile = (isSameOutName: boolean, prefix: string) => (name: string) =>
	!isSameOutName ? name : getImportAsDef(name, prefix);

const serializeSchemaObject = (schema: SchemaObject, rootName: string, cwd: string): SerializedType => {
	switch (schema.type) {
		case undefined: {
			if (is$ref(schema)) {
				const $ref = schema.$ref;
				const parts = fromNullable($ref.match(/^((.+)\/(.+)\.(.+))?#\/(.+)\/(.+)$/));

				const refFileName = pipe(
					parts,
					mapNullable(parts => parts[3]),
				);
				const defBlock = pipe(
					parts,
					mapNullable(parts => parts[5]),
				);
				const safeType = pipe(
					parts,
					mapNullable(parts => parts[6]),
				);

				if (isNone(safeType) || isNone(defBlock)) {
					throw new Error(`Invalid $ref: ${$ref}`);
				}

				const type = safeType.value;

				const io = getIOName(type);
				const isRecursive = isNone(refFileName) && (rootName === type || rootName === io);
				const definitionFilePath = isSome(refFileName)
					? getRelativeOutRefPath(cwd, defBlock.value, refFileName.value, type)
					: getRelativeRefPath(cwd, defBlock.value, type);

				const isSameOuterName = isSameOutName(rootName === type, isSome(refFileName));
				const defName = getDefIFSameName(
					isSameOuterName,
					pipe(
						refFileName,
						getOrElse(() => ''),
					),
				);
				const asDefName = importAsFile(
					isSameOuterName,
					pipe(
						refFileName,
						getOrElse(() => ''),
					),
				);

				return serializedType(
					defName(type),
					defName(io),
					isRecursive
						? EMPTY_DEPENDENCIES
						: [
								dependency(asDefName(type), definitionFilePath),
								dependency(asDefName(io), definitionFilePath),
						  ],
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
			return pipe(
				schema.enum,
				map(serializeEnum),
				alt(() =>
					pipe(
						schema.format,
						chain(format => {
							switch (format) {
								case 'date-time': {
									return some(
										serializedType(
											'Date',
											'DateFromISOString',
											[dependency('DateFromISOString', 'io-ts-types/lib/DateFromISOString')],
											EMPTY_REFS,
										),
									);
								}
							}
							return none;
						}),
					),
				),
				getOrElse(() => serializedType('string', 'string', [dependency('string', 'io-ts')], EMPTY_REFS)),
			);
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
			return pipe(
				schema.additionalProperties,
				map(additionalProperties => serializeAdditionalProperties(additionalProperties, rootName, cwd)),
				alt(() =>
					pipe(
						schema.properties,
						map(properties => {
							const serialized = foldSerialized(
								serializeDictionary(properties, (name, value) => {
									const isRequired = pipe(
										schema.required,
										map(required => required.includes(name)),
										getOrElse(constFalse),
									);
									const field = serializeSchemaObject(value, rootName, cwd);
									const type = isRequired
										? `${name}: ${field.type}`
										: `${name}: Option<${field.type}>`;
									const io = isRequired
										? `${name}: ${field.io}`
										: `${name}: optionFromNullable(${field.io})`;
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
					),
				),
				getOrElse(() =>
					serializedType(
						'unknown',
						'unknownType',
						[dependency('unknownType', getRelativeUtilsPath(cwd))],
						EMPTY_REFS,
					),
				),
			);
		}
	}
};

const serializeEnum = (enumValue: Array<string | number | boolean>): SerializedType => {
	const type = enumValue.map(value => `'${value}'`).join(' | ');
	const io =
		enumValue.length === 1
			? `literal(${type})`
			: `union([${enumValue.map(value => `literal('${value}')`).join(',')}])`;
	return serializedType(type, io, [dependency('union', 'io-ts'), dependency('literal', 'io-ts')], EMPTY_REFS);
};

const serializeAdditionalProperties = (properties: SchemaObject, rootName: string, cwd: string): SerializedType => {
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
	operation: OperationObject,
	rootName: string,
	cwd: string,
): SerializedType => {
	const pathParameters = getOperationParametersInPath(operation);
	const queryParameters = getOperationParametersInQuery(operation);
	const bodyParameters = getOperationParametersInBody(operation);

	const pathParamsSummary = pathParameters.map(serializePathParameterDescription);
	const paramsSummary = serializeParametersDescription(queryParameters, bodyParameters);

	const deprecated = pipe(
		operation.deprecated,
		map(() => `@deprecated`),
	);
	const jsdoc = serializeJSDOC(
		array.compact([deprecated, operation.summary, ...pathParamsSummary.map(some), paramsSummary]),
	);

	const serializedPathParameters = pathParameters.map(serializePathParameter);

	const serializedResponses = serializeOperationResponses(operation.responses, rootName, cwd);

	const operationName = getOperationName(operation, method);

	const serializedUrl = serializeURL(url, serializedPathParameters);

	const serializedQueryParameters = pipe(
		fromArray(queryParameters),
		map(queryParameters => serializeQueryParameters(queryParameters)),
	);
	const serializedBodyParameters = pipe(
		fromArray(bodyParameters),
		map(bodyParameters => serializeBodyParameters(bodyParameters, rootName, cwd)),
	);

	const serializedParameters = intercalateSerializedParameter(
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
		${jsdoc}
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

const serializeOperationResponses = (responses: ResponsesObject, rootName: string, cwd: string): SerializedType => {
	const serializedResponses = uniqSerializedWithoutDependencies(
		array.compact(
			SUCCESSFUL_CODES.map(code =>
				pipe(
					lookup(code, responses),
					chain(response => serializeOperationResponse(code, response, rootName, cwd)),
				),
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
	response: ResponseObject,
	rootName: string,
	cwd: string,
): Option<SerializedType> =>
	pipe(
		response.schema,
		map(schema => serializeSchemaObject(schema, rootName, cwd)),
	);

const serializePathParameter = (parameter: PathParameterObject): SerializedPathParameter => {
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

const serializePathParameterDescription = (parameter: PathParameterObject): string =>
	`@param { ${serializeParameter(parameter).type} } ${parameter.name} ${pipe(
		parameter.description,
		map(d => '- ' + d),
		toUndefined,
	)}`;

const serializeQueryParameter = (parameter: QueryParameterObject): SerializedParameter => {
	const isRequired = pipe(
		parameter.required,
		getOrElse(constFalse),
	);
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

const serializeQueryParameters = (parameters: NonEmptyArray<QueryParameterObject>): SerializedParameter => {
	const serializedParameters = parameters.map(serializeQueryParameter);
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

const serializeBodyParameter = (parameter: BodyParameterObject, rootName: string, cwd: string): SerializedParameter => {
	const isRequired = pipe(
		parameter.required,
		getOrElse(constFalse),
	);
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
	parameters: NonEmptyArray<BodyParameterObject>,
	rootName: string,
	cwd: string,
): SerializedParameter => {
	// according to spec there can be only one body parameter
	const serializedBodyParameter = serializeBodyParameter(head(parameters), rootName, cwd);
	const { type, isRequired, io, dependencies, refs } = serializedBodyParameter;
	return serializedParameter(
		`body${unless(isRequired, '?')}: ${type}`,
		`body: ${io}`,
		isRequired,
		dependencies,
		refs,
	);
};

const serializeParametersDescription = (query: QueryParameterObject[], body: BodyParameterObject[]): Option<string> => {
	const parameters = [...query, ...body];
	return parameters.length === 0
		? none
		: some(hasRequiredParameters(parameters) ? '@param { object } parameters' : '@param { object } [parameters]');
};

const serializeParameter = (parameter: PathParameterObject | QueryParameterObject): SerializedParameter => {
	const isRequired =
		typeof parameter.required === 'boolean'
			? parameter.required
			: pipe(
					parameter.required,
					getOrElse(constFalse),
			  );
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

const serializeNonArrayItemsObject = (items: NonArrayItemsObject): SerializedType => {
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
const getOperationName = (operation: OperationObject, httpMethod: string) =>
	pipe(
		operation.operationId,
		getOrElse(() => httpMethod),
	);

const serializeDependencies = (dependencies: Dependency[]): string =>
	pipe(
		pipe(
			dependencies,
			groupBy(dependency => dependency.path),
		),
		collect((key, dependencies) => {
			const names = uniqString(dependencies.map(dependency => dependency.name));
			return `import { ${names.join(',')} } from '${head(dependencies).path}';`;
		}),
	).join('');

const client = `
	import { LiveData } from '@devexperts/rx-utils/dist/rd/live-data.utils';
	import { Errors, mixed } from 'io-ts';
	import { report } from '../utils/utils';
	import { left } from 'fp-ts/lib/Either';

	export type APIRequest = {
		url: string;
		query?: object;
		body?: unknown;
	};

	export type FullAPIRequest = APIRequest & {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	};
	
	export type APIClient = {
		readonly request: (request: FullAPIRequest) => LiveData<Error, mixed>;
	};
	
	export class ResponseValidationError extends Error {
		static create(errors: Errors): ResponseValidationError {
			return new ResponseValidationError(errors);
		} 
	
		constructor(readonly errors: Errors) {
			super(report(left(errors)).toString());
			this.name = 'ResponseValidationError';
			Object.setPrototypeOf(this, ResponseValidationError);
		}
	}
`;

const utils = `
	import { Type, success, identity, Errors, Validation, Context, ValidationError } from 'io-ts';
	import { fold } from 'fp-ts/lib/Either';

	export const unknownType = new class UnknownType extends Type<unknown> {
		readonly _tag: 'UnknownType' = 'UnknownType';

		constructor() {
			super('unknownType', (_: unknown): _ is unknown => true, success, identity);
		}
	}();

	function getMessage(e: ValidationError) {
		return e.message !== undefined ? e.message : 
			createMessage(e.context)
			+ '\\n in context: \\n' 
			+ getContextPath(e.context);
	}

	function createMessage(context: Context) {
		return (
			'\\n Received: \\n  ' +
			JSON.stringify(context[context.length - 1].actual) +
			'\\n expected: \\n  ' +
			context[context.length - 1].type.name +
			'\\n in field \\n  ' +
			context[context.length - 1].key
		);
	}

	function getContextPath(context: Context) {
		return context
			.map(function(cEntry, index) {
				const padding = new Array(index * 2 + 2).fill(' ').join('');
				return (
					padding + cEntry.key + (index > 0 ? ': ' : '') + cEntry.type.name.replace(/([,{])/g, '$1 \\n' + padding)
				);
			})
			.join(' -> \\n');
	}

	function fail(es: Errors) {
		return es.map(getMessage);
	}

	function ok() {
		return ['No errors!'];
	}

	export const report: (validation: Validation<unknown>) => string[] = fold(fail, ok);
`;

const hasRequiredParameters = (parameters: Array<QueryParameterObject | BodyParameterObject>): boolean =>
	parameters.some(p =>
		pipe(
			p.required,
			exists(identity),
		),
	);

const serializeRequired = (name: string, type: string, io: string, isRequired: boolean): SerializedType =>
	isRequired
		? serializedType(`${name}: ${type}`, `${name}: ${io}`, EMPTY_DEPENDENCIES, EMPTY_REFS)
		: serializedType(
				`${name}: Option<${type}>`,
				`${name}: optionFromNullable(${io})`,
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

const serializeURL = (url: string, pathParameters: SerializedPathParameter[]): string =>
	pathParameters.reduce(
		(acc, p) => acc.replace(`{${p.name}}`, `\$\{encodeURIComponent(${p.io}.toString())\}`),
		`\`${url}\``,
	);

const toObjectType = (serialized: SerializedType, recursion: Option<string>): SerializedType => {
	const io = `type({ ${serialized.io} })`;
	return serializedType(
		`{ ${serialized.type} }`,
		pipe(
			recursion,
			map(recursion => {
				const recursionIO = getIOName(recursion);
				return `recursion<${recursion}, unknown>('${recursionIO}', ${recursionIO} => ${io})`;
			}),
			getOrElse(() => io),
		),
		concatIfL(isSome(recursion), [...serialized.dependencies, dependency('type', 'io-ts')], () => [
			dependency('recursion', 'io-ts'),
		]),
		EMPTY_REFS,
	);
};
