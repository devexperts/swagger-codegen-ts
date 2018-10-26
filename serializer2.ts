import {
	TDefinitionsObject,
	TNonArrayItemsObject,
	TOperationObject,
	TPathItemObject,
	TPathParameterObject,
	TPathsObject,
	TQueryParameterObject,
	TSchemaObject,
	TSwaggerObject,
} from './swagger';
import { directory, file, TDirectory, TFile } from './fs';
import { array, catOptions, flatten, uniq } from 'fp-ts/lib/Array';
import { contramap, Setoid, setoidString } from 'fp-ts/lib/Setoid';
import { group } from 'fp-ts/lib/NonEmptyArray';
import { getOperationParametersInPath, getOperationParametersInQuery, groupPathsByTag } from './utils';
import { fromNullable, none, Option, some } from 'fp-ts/lib/Option';
import { getArrayMonoid, getRecordMonoid, monoidString, fold } from 'fp-ts/lib/Monoid';
import { camelize } from '@devexperts/utils/dist/string/string';

// TFSEntity serializers
type TDepdendency = {
	path: string;
	name: string;
};
type TSerialized = {
	content: string;
	dependencies: TDepdendency[];
};
export type TMethod = 'GET' | 'POST';

const monoidDependencies = getArrayMonoid<TDepdendency>();
const monoidSerialized = getRecordMonoid<TSerialized>({
	content: monoidString,
	dependencies: monoidDependencies,
});
const foldSerialized = fold(monoidSerialized);

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
	const serialized = serializeSchemaObjectType(definition);
	const serializedIO = serializeIOSchemaObjectType(definition);

	const dependencies = serializeDependencies([...serialized.dependencies, ...serializedIO.dependencies]);

	return file(
		`${name}.ts`,
		`
		import { Option } from 'fp-ts/lib/Option';
		import { createOptionFromNullable } from 'io-ts-types';
		import * as t from 'io-ts';
		${dependencies}
		
		export type ${name} = ${serialized.content};
		export const ${getIOName(name)} = ${serializedIO.content};
	`,
	);
};

const serializePathGroup = (name: string, group: Record<string, TPathItemObject>): TFile => {
	const serialized = foldSerialized(serializeDictionary(group, serializePath));
	const dependencies = serializeDependencies(serialized.dependencies);
	const groupName = name || 'Unknown';
	return file(
		`${groupName}.ts`,
		`
			${dependencies}
		
			export type ${groupName} = {
				${serialized.content}
			}
		`,
	);
};
const serializePath = (path: string, item: TPathItemObject): TSerialized => {
	const get = item.get.map(operation => serializeOperationObjectType(path, 'GET', operation));
	const put = item.put.map(operation => serializeOperationObjectType(path, 'PUT', operation));
	const post = item.post.map(operation => serializeOperationObjectType(path, 'POST', operation));
	const remove = item['delete'].map(operation => serializeOperationObjectType(path, 'DELETE', operation));
	const options = item.options.map(operation => serializeOperationObjectType(path, 'OPTIONS', operation));
	const head = item.head.map(operation => serializeOperationObjectType(path, 'HEAD', operation));
	const patch = item.patch.map(operation => serializeOperationObjectType(path, 'PATCH', operation));
	const operations = catOptions([get, put, post, remove, options, head, patch]);
	return foldSerialized(operations);
};

// string serializers

const serializeSchemaObjectType = (schema: TSchemaObject): TSerialized => {
	switch (schema.type) {
		case undefined: {
			const reference = `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
			return {
				content: reference,
				dependencies: [{ path: `./${reference}`, name: reference }],
			};
		}
		case 'string': {
			return {
				content: schema.enum.map(serializeEnum).getOrElse('string'),
				dependencies: [],
			};
		}
		case 'boolean':
		case 'number': {
			return {
				content: schema.type,
				dependencies: [],
			};
		}
		case 'integer': {
			return {
				content: 'number',
				dependencies: [],
			};
		}
		case 'array': {
			const result = serializeSchemaObjectType(schema.items);
			return {
				content: `Array<${result.content}>`,
				dependencies: result.dependencies,
			};
		}
		case 'object': {
			const additional = schema.additionalProperties.map(serializeAdditionalProperties);
			const serialized = additional.orElse(() =>
				schema.properties.map(properties => {
					const fields = serializeDictionary(properties, (name, value) => {
						const serialized = serializeField(
							name,
							value,
							schema.required.map(required => required.includes(name)).getOrElse(false),
						);
						return {
							content: `${serialized.content};`,
							dependencies: serialized.dependencies,
						};
					});
					const content = `{ ${fields.map(field => field.content).join('')} }`;
					const dependencies = flatten(fields.map(field => field.dependencies || []));
					return {
						content,
						dependencies,
					};
				}),
			);
			return {
				content: serialized.map(serialized => serialized.content).getOrElse('{}'),
				dependencies: serialized.map(serialized => serialized.dependencies).getOrElse([]),
			};
		}
	}
};

const serializeIOSchemaObjectType = (schema: TSchemaObject): TSerialized => {
	switch (schema.type) {
		case undefined: {
			const reference = `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
			const name = getIOName(reference);
			return {
				content: name,
				dependencies: [{ path: `./${reference}`, name: name }],
			};
		}
		case 'string': {
			return {
				content: schema.enum.map(serializeIOEnum).getOrElse('t.string'),
				dependencies: [],
			};
		}
		case 'boolean': {
			return {
				content: 't.boolean',
				dependencies: [],
			};
		}
		case 'integer':
		case 'number': {
			return {
				content: 't.number',
				dependencies: [],
			};
		}
		case 'array': {
			const result = serializeIOSchemaObjectType(schema.items);
			return {
				content: `t.array(${result.content})`,
				dependencies: result.dependencies,
			};
		}
		case 'object': {
			const additional = schema.additionalProperties.map(serializeIOAdditionalProperties);
			const serialized = additional.orElse(() =>
				schema.properties.map(properties => {
					const fields = serializeDictionary(properties, (name, value) =>
						serializeIOField(
							name,
							value,
							schema.required.map(required => required.includes(name)).getOrElse(false),
						),
					);
					const content = `t.type({ ${fields.map(field => field.content).join('')} })`;
					const dependencies = flatten(fields.map(field => field.dependencies || []));
					return {
						content,
						dependencies,
					};
				}),
			);
			return {
				content: serialized.map(serialized => serialized.content).getOrElse('t.type({})'),
				dependencies: serialized.map(serialized => serialized.dependencies).getOrElse([]),
			};
		}
	}
};

const serializeField = (name: string, schema: TSchemaObject, isRequired: boolean): TSerialized => {
	const serialized = serializeSchemaObjectType(schema);
	return {
		content: isRequired ? `${name}: ${serialized.content}` : `${name}: Option<${serialized.content}>`,
		dependencies: serialized.dependencies,
	};
};

const serializeIOField = (name: string, schema: TSchemaObject, isRequired: boolean): TSerialized => {
	const serialized = serializeIOSchemaObjectType(schema);
	return {
		content: isRequired
			? `${name}: ${serialized.content},`
			: `${name}: createOptionFromNullable(${serialized.content}),`,
		dependencies: serialized.dependencies,
	};
};

const serializeEnum = (enumValue: Array<string | number | boolean>): string =>
	enumValue.map(value => `'${value}'`).join(' | ');

const serializeIOEnum = (enumValue: Array<string | number | boolean>): string => {
	const serializedValue = enumValue.map(value => `t.literal('${value}')`).join(',');
	return `t.union([${serializedValue}])`;
};

const serializeAdditionalProperties = (properties: TSchemaObject): TSerialized => {
	const serialized = serializeSchemaObjectType(properties);
	return {
		content: `{ [key: string]: ${serialized.content} }`,
		dependencies: serialized.dependencies,
	};
};

const serializeIOAdditionalProperties = (properties: TSchemaObject): TSerialized => {
	const serialized = serializeIOSchemaObjectType(properties);
	return {
		content: `t.dictionary(t.string, ${serialized.content})`,
		dependencies: serialized.dependencies,
	};
};

const serializeOperationObjectType = (
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
	operation: TOperationObject,
): TSerialized => {
	const parametersInPath = getOperationParametersInPath(operation);
	const paramsSummary = parametersInPath.map(serializePathParameterDescription);
	const serializedParams = serializePathParameters(parametersInPath);
	const lines = [...array.compact([operation.summary]), ...paramsSummary];
	const parametersInQuery = getOperationParametersInQuery(operation);
	const serializedQuery = serializeQueryParametersType(parametersInQuery);

	const args = catOptions([serializedParams, serializedQuery.map(query => query.content)]).join(', ');
	return {
		content: `
			/**
			 ${lines.map(line => `* ${line}`).join('\n')}
			 */
			readonly ${getOperationName(operation, method)}: (${args}) => LiveData<Error, any>;
		`,
		dependencies: [
			{
				name: 'LiveData',
				path: '@devexperts/rx-utils/dist/rd/live-data.utils',
			},
		],
	};
};

const serializePathParameter = (parameter: TPathParameterObject): string =>
	`${camelize(parameter.name)}: ${serializePathParameterType(parameter)}`;
const serializePathParameters = (parameters: TPathParameterObject[]): Option<string> =>
	parameters.length === 0 ? none : some(parameters.map(serializePathParameter).join(', '));
const serializeQueryParametersType = (parameters: TQueryParameterObject[]): Option<TSerialized> => {
	if (parameters.length === 0) {
		return none;
	}
	const isRequired = parameters.some(p => p.required.isSome() && p.required.value);
	return some(
		serializeField(
			'query',
			{ type: 'object', properties: none, required: none, additionalProperties: none },
			isRequired,
		),
	);
};

const serializePathParameterDescription = (parameter: TPathParameterObject): string =>
	`@param {${serializePathParameterType(parameter)}} ${camelize(parameter.name)} ${parameter.description
		.map(d => '- ' + d)
		.toUndefined()}`;

const serializePathParameterType = (parameter: TPathParameterObject): string => {
	switch (parameter.type) {
		case 'string':
		case 'boolean':
		case 'number': {
			return parameter.type;
		}
		case 'integer': {
			return 'number';
		}
		case 'array': {
			return serializeNonArrayItemsObjectType(parameter.items);
		}
	}
};

const serializeNonArrayItemsObjectType = (items: TNonArrayItemsObject): string => {
	switch (items.type) {
		case 'string':
		case 'boolean':
		case 'number': {
			return items.type;
		}
		case 'integer': {
			return 'number';
		}
	}
};

// serialization helpers

const serializeDictionary = <A, B>(dictionary: Record<string, A>, serializeValue: (name: string, value: A) => B): B[] =>
	Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));

const getIOName = (name: string): string => `${name}IO`;
const getOperationName = (operation: TOperationObject, httpMethod: string) =>
	operation.operationId.getOrElse(httpMethod);

const setoidDependencyPath: Setoid<TDepdendency> = contramap(dependency => dependency.path, setoidString);
const setoidDependencyName: Setoid<TDepdendency> = contramap(dependency => dependency.name, setoidString);
const groupDependenciesByPath = group(setoidDependencyPath);
const uniqueDependencyPathName = uniq(setoidDependencyName);
const serializeDependencies = (dependencies: TDepdendency[]): string => {
	const groupped = groupDependenciesByPath(dependencies);
	return groupped
		.map(groupped => {
			const names = uniqueDependencyPathName(groupped.toArray()).map(dependency => dependency.name);
			return `import { ${names.join(',')} } from '${groupped.head.path}';`;
		})
		.join('');
};

const client = `
	import { LiveData } from '@devexperts/rx-utils/dist/rd/live-data.utils';
	
	export type TAPIRequest = {
		url: string;
		query?: object;
		body?: object;
	};

	export type TFullAPIRequest = TAPIRequest & {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
	};
	
	export type TAPIClient<E> = {
		readonly request: <R>(request: TFullAPIRequest) => LiveData<E, R>;
		readonly get: <R>(request: TAPIRequest) => LiveData<E, R>;
		readonly post: <R>(request: TAPIRequest) => LiveData<E, R>;
		readonly remove: <R>(request: TAPIRequest) => LiveData<E, R>;
		readonly put: <R>(request: TAPIRequest) => LiveData<E, R>;
	};
`;
