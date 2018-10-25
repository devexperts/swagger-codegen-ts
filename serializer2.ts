import {
	TDefinitionsObject,
	TOperationObject,
	TPathItemObject,
	TPathsObject,
	TSchemaObject,
	TSwaggerObject,
} from './swagger';
import { directory, file, TDirectory, TFile } from './fs';
import { catOptions, flatten, uniq } from 'fp-ts/lib/Array';
import { contramap, getRecordSetoid, Setoid, setoidString } from 'fp-ts/lib/Setoid';
import { group } from 'fp-ts/lib/NonEmptyArray';
import { groupPathsByTag } from './utils';

// TFSEntity serializers
type TDepdendency = {
	path: string;
	name: string;
};
type TSerialized = {
	content: string;
	dependencies?: TDepdendency[];
};

export const serializeSwaggerObject = (name: string, swaggerObject: TSwaggerObject): TDirectory =>
	directory(name, [
		directory('client', [file('client.ts', client)]),
		...catOptions([swaggerObject.definitions.map(serializeDefinitions)]),
		serializePaths(swaggerObject.paths),
	]);

const serializeDefinitions = (definitions: TDefinitionsObject): TDirectory =>
	directory('definitions', [...serializeDictionary(definitions, serializeDefinition)]);
const serializePaths = (paths: TPathsObject): TDirectory => {
	return directory('paths', serializeDictionary(groupPathsByTag(paths), serializePathGroup));
};

const serializeDefinition = (name: string, definition: TSchemaObject): TFile => {
	const serialized = serializeSchemaObjectType(definition);
	const serializedIO = serializeIOSchemaObjectType(definition);

	const dependencies = serializeDependencies([
		...(serialized.dependencies || []),
		...(serializedIO.dependencies || []),
	]);

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

const UNKNOWN_PATH = 'unknown';
const serializePathGroup = (name: string, paths: Record<string, TPathItemObject>): TFile => {
	const serialized = serializeDictionary(paths, serializePathItem);
	const content = serialized.map(serialized => serialized.content).join('');
	return file(
		`${name || UNKNOWN_PATH}.ts`,
		`
		/*
		${content}
		*/
	`,
	);
};
const serializePathItem = (path: string, item: TPathItemObject): TSerialized => {
	return {
		content: `'${path}'`,
	};
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
			};
		}
		case 'boolean':
		case 'number': {
			return { content: schema.type };
		}
		case 'integer': {
			return { content: 'number' };
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
					const fields = serializeDictionary(properties, (name, value) =>
						serializeField(
							name,
							value,
							schema.required.map(required => required.includes(name)).getOrElse(false),
						),
					);
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
			};
		}
		case 'boolean': {
			return {
				content: 't.boolean',
			};
		}
		case 'integer':
		case 'number': {
			return {
				content: 't.number',
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
		content: isRequired ? `${name}: ${serialized.content};` : `${name}: Option<${serialized.content}>;`,
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

const serializeOperationObjectType = (method: string, item: TOperationObject): string => {
	return `
		${item.operationId}: () => LiveData<Error, unknown>
	`;
};

// serialization helpers

const serializeDictionary = <A, B>(dictionary: Record<string, A>, serializeValue: (name: string, value: A) => B): B[] =>
	Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));

const getIOName = (name: string): string => `${name}IO`;
const getPathGroupName = (name: string): string => name.replace(/\s/g, '');

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
