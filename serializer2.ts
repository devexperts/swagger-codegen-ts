import {
	TBodyParameterObject,
	TDefinitionsObject,
	TNonArrayItemsObject,
	TOperationObject,
	TPathItemObject,
	TPathParameterObject,
	TPathsObject,
	TQueryParameterObject,
	TResponseObject,
	TResponsesObject,
	TSchemaObject,
	TSwaggerObject,
} from './swagger';
import { directory, file, TDirectory, TFile } from './fs';
import { array, catOptions, uniq } from 'fp-ts/lib/Array';
import { getRecordSetoid, setoidString } from 'fp-ts/lib/Setoid';
import { groupBy } from 'fp-ts/lib/NonEmptyArray';
import {
	getOperationParametersInBody,
	getOperationParametersInPath,
	getOperationParametersInQuery,
	groupPathsByTag,
} from './utils';
import { none, Option, some } from 'fp-ts/lib/Option';
import { getArrayMonoid, getRecordMonoid, monoidString, fold } from 'fp-ts/lib/Monoid';
import { camelize } from '@devexperts/utils/dist/string/string';
import { intercalate } from 'fp-ts/lib/Foldable2v';
import { collect, lookup } from 'fp-ts/lib/Record';
import { constTrue } from 'fp-ts/lib/function';

const emptyArray: any[] = [];

// TFSEntity serializers
type TDepdendency = {
	path: string;
	name: string;
};
type TSerialized = {
	type: string;
	io: string;
	dependencies: TDepdendency[];
};

const monoidDependencies = getArrayMonoid<TDepdendency>();
const monoidSerialized = getRecordMonoid<TSerialized>({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
});
const setoidSerializedWithoutDependencies = getRecordSetoid<TSerialized>({
	type: setoidString,
	io: setoidString,
	dependencies: {
		equals: constTrue,
	},
});
const foldSerialized = fold(monoidSerialized);
const intercalateSerialized = intercalate(monoidSerialized, array);
const uniqString = uniq(setoidString);
const uniqSerializedWithoutDependencies = uniq(setoidSerializedWithoutDependencies);

export const serializeSwaggerObject = (name: string, swaggerObject: TSwaggerObject): TDirectory =>
	directory(name, [
		directory('client', [file('client.ts', client)]),
		...catOptions([swaggerObject.definitions.map(serializeDefinitions)]),
		serializePaths(swaggerObject.paths),
	]);

const serializeDefinitions = (definitions: TDefinitionsObject): TDirectory =>
	directory('definitions', [...serializeDictionary(definitions, serializeDefinition)]);
const serializePaths = (paths: TPathsObject): TDirectory =>
	directory('paths', serializeDictionary(groupPathsByTag(paths), serializePathGroup));

const serializeDefinition = (name: string, definition: TSchemaObject): TFile => {
	const serialized = serializeSchemaObjectType(definition, './');

	const dependencies = serializeDependencies([
		...serialized.dependencies,
		{
			name: 'Option',
			path: 'fp-ts/lib/Option',
		},
		{
			name: 'createOptionFromNullable',
			path: 'io-ts-types',
		},
	]);

	return file(
		`${name}.ts`,
		`
			import * as t from 'io-ts';
			${dependencies}
			
			export type ${name} = ${serialized.type};
			export const ${getIOName(name)} = ${serialized.io};
		`,
	);
};

const serializePathGroup = (name: string, group: Record<string, TPathItemObject>): TFile => {
	const serialized = foldSerialized(serializeDictionary(group, serializePath));
	const dependencies = serializeDependencies([
		...serialized.dependencies,
		{
			name: 'asks',
			path: 'fp-ts/lib/Reader',
		},
		{
			name: 'TAPIClient',
			path: '../client/client',
		},
	]);
	const groupName = name || 'Unknown';
	return file(
		`${groupName}.ts`,
		`
			import * as t from 'io-ts';
			${dependencies}
		
			export type ${groupName} = {
				${serialized.type}
			};
			
			export const ${camelize(groupName, true)} = asks((e: { apiClient: TAPIClient }): ${groupName} => ({
				${serialized.io}
			}));
		`,
	);
};
const serializePath = (path: string, item: TPathItemObject): TSerialized => {
	const get = item.get.map(operation => serializeOperationObject(path, 'GET', operation));
	const put = item.put.map(operation => serializeOperationObject(path, 'PUT', operation));
	const post = item.post.map(operation => serializeOperationObject(path, 'POST', operation));
	const remove = item['delete'].map(operation => serializeOperationObject(path, 'DELETE', operation));
	const options = item.options.map(operation => serializeOperationObject(path, 'OPTIONS', operation));
	const head = item.head.map(operation => serializeOperationObject(path, 'HEAD', operation));
	const patch = item.patch.map(operation => serializeOperationObject(path, 'PATCH', operation));
	const operations = catOptions([get, put, post, remove, options, head, patch]);
	return foldSerialized(operations);
};

// string serializers

const serializeSchemaObjectType = (schema: TSchemaObject, relative: string): TSerialized => {
	switch (schema.type) {
		case undefined: {
			const type = `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
			const io = getIOName(type);
			return {
				type,
				io,
				dependencies: [{ path: `${relative}${type}`, name: type }, { path: `${relative}${type}`, name: io }],
			};
		}
		case 'string': {
			return schema.enum.map(serializeEnum).getOrElseL(() => ({
				type: 'string',
				io: 't.string',
				dependencies: emptyArray,
			}));
		}
		case 'boolean': {
			return {
				type: 'boolean',
				io: 't.boolean',
				dependencies: emptyArray,
			};
		}
		case 'integer':
		case 'number': {
			return {
				type: 'number',
				io: 't.nubmer',
				dependencies: emptyArray,
			};
		}
		case 'array': {
			const result = serializeSchemaObjectType(schema.items, relative);
			return {
				type: `Array<${result.type}>`,
				io: `t.array(${result.io})`,
				dependencies: result.dependencies,
			};
		}
		case 'object': {
			const additional = schema.additionalProperties.map(additionalProperties =>
				serializeAdditionalProperties(additionalProperties, relative),
			);
			const serialized = additional.orElse(() =>
				schema.properties.map(properties => {
					const fields = foldSerialized(
						serializeDictionary(properties, (name, value) => {
							const serialized = serializeField(
								name,
								value,
								schema.required.map(required => required.includes(name)).getOrElse(false),
								relative,
							);
							return {
								type: `${serialized.type};`,
								io: `${serialized.io},`,
								dependencies: serialized.dependencies,
							};
						}),
					);
					const type = `{ ${fields.type} }`;
					const io = `t.type({ ${fields.io} })`;
					const dependencies = fields.dependencies;
					return {
						type,
						io,
						dependencies,
					};
				}),
			);
			return serialized.getOrElseL(() => ({
				type: '{}',
				io: 't.type({})',
				dependencies: emptyArray,
			}));
		}
	}
};

const serializeField = (name: string, schema: TSchemaObject, isRequired: boolean, relative: string): TSerialized => {
	const serialized = serializeSchemaObjectType(schema, relative);
	return {
		type: isRequired ? `${name}: ${serialized.type}` : `${name}: Option<${serialized.type}>`,
		io: isRequired ? `${name}: ${serialized.io}` : `${name}: createOptionFromNullable(${serialized.io})`,
		dependencies: serialized.dependencies,
	};
};

const serializeEnum = (enumValue: Array<string | number | boolean>): TSerialized => {
	const type = enumValue.map(value => `'${value}'`).join(' | ');
	const io = `t.union([${enumValue.map(value => `t.literal('${value}')`).join(',')}])`;
	return {
		type,
		io,
		dependencies: emptyArray,
	};
};

const serializeAdditionalProperties = (properties: TSchemaObject, relative: string): TSerialized => {
	const serialized = serializeSchemaObjectType(properties, relative);
	return {
		type: `{ [key: string]: ${serialized.type} }`,
		io: `t.dictionary(t.string, ${serialized.io})`,
		dependencies: serialized.dependencies,
	};
};

const serializeOperationObject = (
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
	operation: TOperationObject,
): TSerialized => {
	const relative = '../definitions/';

	const pathParameters = getOperationParametersInPath(operation);
	const queryParameters = getOperationParametersInQuery(operation);
	const bodyParameters = getOperationParametersInBody(operation);

	const pathParamsSummary = pathParameters.map(serializePathParameterDescription);
	const queryParamsSummary = serializeQueryParametersDescription(queryParameters);
	const bodyParamsSummary = serializeBodyParametersDescription(bodyParameters);

	const deprecated = operation.deprecated.map(deprecated => `@deprecated`);
	const lines = array.compact([
		deprecated,
		operation.summary,
		...pathParamsSummary.map(some),
		bodyParamsSummary,
		queryParamsSummary,
	]);

	const serializedPathParams = pathParameters.map(serializePathParameter);
	const serializedQueryParams = serializeQueryParameters(queryParameters);
	const serializedBodyParams = serializeBodyParameters(bodyParameters, relative);

	const serializedPathParameters =
		pathParameters.length === 0 ? none : some(pathParameters.map(param => param.name).join(','));
	const serializedQueryParameters = queryParameters.length === 0 ? none : some('query');
	const serializedBodyParameters = bodyParameters.length === 0 ? none : some('body');
	
	const args: TSerialized = {
		type: catOptions([
			serializedPathParams.length === 0 ? none : some(serializedPathParams.map(param => param.type).join(',')),
			serializedBodyParams.map(parameters => parameters.type),
			serializedQueryParams.type === '' ? none : some(serializedQueryParams.type),
		]).join(', '),
		io: catOptions([serializedPathParameters, serializedBodyParameters, serializedQueryParameters]).join(','),
		dependencies: emptyArray,
	};

	const serializedResponses = serializeOperationResponses(operation.responses, relative);
	const url = pathParameters.reduce((acc, p) => acc.replace(`{${p.name}}`, `\$\{${p.name}\}`), `\`${path}\``);
	const query = serializedQueryParameters.map(query => `query: ${query},`).getOrElse('');
	const body = serializedBodyParameters.map(body => `body: ${body},`).getOrElse('');
	return {
		type: `
			/**
			 ${lines.map(line => `* ${line}`).join('\n')}
			 */
			readonly ${getOperationName(operation, method)}: (${args.type}) => LiveData<Error, ${serializedResponses.type}>;
		`,
		io: `
			${getOperationName(operation, method)}: (${args.io}) => e.apiClient.request({
				url: ${url},
				method: '${method}',
				${body}
				${query}
			}).pipe(map(data => data.chain(value => fromEither(${
				serializedResponses.io
			}.decode(value).mapLeft(ResponseValiationError.create))))),
		`,
		dependencies: [
			{
				name: 'map',
				path: 'rxjs/operators',
			},
			{
				name: 'fromEither',
				path: '@devexperts/remote-data-ts',
			},
			{
				name: 'ResponseValiationError',
				path: '../client/client',
			},
			{
				name: 'LiveData',
				path: '@devexperts/rx-utils/dist/rd/live-data.utils',
			},
			...serializedResponses.dependencies,
			...serializedBodyParams.map(parameters => parameters.dependencies).getOrElse([]),
		],
	};
};

const serializeOperationResponses = (responses: TResponsesObject, relative: string): TSerialized => {
	const serialized = uniqSerializedWithoutDependencies(
		catOptions(
			['200', 'default'].map(code =>
				lookup(code, responses).chain(response => serializeOperationResponse(code, response, relative)),
			),
		),
	);
	if (serialized.length === 0) {
		return {
			type: 'void',
			io: 't.void',
			dependencies: emptyArray,
		};
	}
	const combined = intercalateSerialized({ type: '|', io: ',', dependencies: emptyArray }, serialized);
	return {
		type: combined.type,
		io: serialized.length > 1 ? `t.union([${combined.io}])` : combined.io,
		dependencies: combined.dependencies,
	};
};

const serializeOperationResponse = (code: string, response: TResponseObject, relative: string): Option<TSerialized> =>
	response.schema.map(schema => serializeSchemaObjectType(schema, relative));

const serializePathParameter = (parameter: TPathParameterObject): TSerialized => {
	const serialized = serializeParameterType(parameter);
	return {
		type: `${parameter.name}: ${serialized.type}`,
		io: `${serialized.io}.decode(${parameter.name})`,
		dependencies: serialized.dependencies,
	};
};

const serializePathParameterDescription = (parameter: TPathParameterObject): string =>
	`@param { ${serializeParameterType(parameter).type} } ${parameter.name} ${parameter.description
		.map(d => '- ' + d)
		.toUndefined()}`;

const serializeQueryParameter = (parameter: TQueryParameterObject): TSerialized => {
	const isRequired = parameter.required.getOrElse(false);
	const serialized = serializeParameterType(parameter);
	return {
		type: serializeRequired(parameter.name, serialized.type, isRequired),
		io: 't.any',
		dependencies: serialized.dependencies,
	};
};
const serializeQueryParameters = (parameters: TQueryParameterObject[]): TSerialized => {
	const isRequired = hasRequiredParameters(parameters);
	const serializedParameters = parameters.map(serializeQueryParameter);
	const intercalated = intercalateSerialized(
		{
			type: ';',
			io: ',',
			dependencies: emptyArray,
		},
		serializedParameters,
	);
	return {
		type: serializeRequired('query', `{ ${intercalated.type} }`, isRequired),
		io: 't.any',
		dependencies: intercalated.dependencies,
	};
};
const serializeQueryParametersDescription = (parameters: TQueryParameterObject[]): Option<string> =>
	parameters.length === 0
		? none
		: some(hasRequiredParameters(parameters) ? '@param { object } query' : '@param { object } [query]');

const serializeBodyParameter = (parameter: TBodyParameterObject, relative: string): TSerialized => {
	const isRequired = parameter.required.getOrElse(false);
	const serialized = serializeSchemaObjectType(parameter.schema, relative);
	return {
		type: `${parameter.name}${isRequired ? '' : '?'}: ${serialized.type}`,
		io: 't.any',
		dependencies: serialized.dependencies,
	};
};
const serializeBodyParameters = (parameters: TBodyParameterObject[], relative: string): Option<TSerialized> => {
	if (parameters.length === 0) {
		return none;
	}
	const isRequired = hasRequiredParameters(parameters);
	const serializedParameters = parameters.map(parameter => serializeBodyParameter(parameter, relative));
	const result = intercalateSerialized({ type: ';', io: ',', dependencies: emptyArray }, serializedParameters);
	return some({
		type: `body${isRequired ? '' : '?'}: { ${result.type} }`,
		io: 't.any',
		dependencies: result.dependencies,
	});
};
const serializeBodyParametersDescription = (parameters: TBodyParameterObject[]): Option<string> =>
	parameters.length === 0
		? none
		: some(hasRequiredParameters(parameters) ? '@param { object } body' : '@param { object } [body]');

const serializeParameterType = (parameter: TPathParameterObject | TQueryParameterObject): TSerialized => {
	switch (parameter.type) {
		case 'array': {
			return serializeNonArrayItemsObjectType(parameter.items);
		}
		case 'string': {
			return {
				type: 'string',
				io: 't.string',
				dependencies: emptyArray,
			};
		}
		case 'boolean': {
			return {
				type: 'boolean',
				io: 't.boolean',
				dependencies: emptyArray,
			};
		}
		case 'integer':
		case 'number': {
			return {
				type: 'number',
				io: 't.number',
				dependencies: emptyArray,
			};
		}
	}
};

const serializeNonArrayItemsObjectType = (items: TNonArrayItemsObject): TSerialized => {
	switch (items.type) {
		case 'string': {
			return {
				type: 'string',
				io: 't.string',
				dependencies: emptyArray,
			};
		}
		case 'boolean': {
			return {
				type: 'boolean',
				io: 't.boolean',
				dependencies: emptyArray,
			};
		}
		case 'integer':
		case 'number': {
			return {
				type: 'number',
				io: 't.number',
				dependencies: emptyArray,
			};
		}
	}
};

// serialization helpers

const serializeDictionary = <A, B>(dictionary: Record<string, A>, serializeValue: (name: string, value: A) => B): B[] =>
	Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));

const getIOName = (name: string): string => `${name}IO`;
const getOperationName = (operation: TOperationObject, httpMethod: string) =>
	operation.operationId.getOrElse(httpMethod);

const serializeDependencies = (dependencies: TDepdendency[]): string =>
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
		body?: object;
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
	
		constructor(errors: Errors) {
			super('ResponseValiationError');
			Object.setPrototypeOf(this, ResponseValiationError);
		}
	}
`;

const hasRequiredParameters = (parameters: Array<TQueryParameterObject | TBodyParameterObject>): boolean =>
	parameters.some(p => p.required.isSome() && p.required.value);

const serializeRequired = (name: string, type: string, isRequired: boolean): string =>
	`${name}${isRequired ? '' : '?'}:${type}`;
