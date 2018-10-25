import { TDefinitionsObject, TPathsObject, TSchemaObject, TSwaggerObject } from './swagger';
import { directory, file, TDirectory, TFile } from './fs';
import { catOptions, flatten, uniq } from 'fp-ts/lib/Array';
import { fromNullable } from 'fp-ts/lib/Option';
import { setoidString } from 'fp-ts/lib/Setoid';

// TFSEntity serializers
type TSerializedSchemObjectWithDependencies = {
	content: string;
	dependencies?: string[];
};

const uniqueString = uniq(setoidString);

export const serializeSwaggerObject = (name: string, swaggerObject: TSwaggerObject): TDirectory =>
	directory(name, [
		...catOptions([swaggerObject.definitions.map(serializeDefinitions)]),
		serializePaths(swaggerObject.paths),
	]);

const serializeDefinitions = (definitions: TDefinitionsObject): TDirectory =>
	directory('definitions', [
		serializeDefinitionsIndex(definitions),
		...serializeDictionary(definitions, serializeDefinition),
	]);
const serializePaths = (definitions: TPathsObject): TDirectory => directory('paths', []);

const serializeDefinition = (name: string, definition: TSchemaObject): TFile => {
	const serialized = serializeSchemaObjectType(definition);
	const dependencies = uniqueString(serialized.dependencies || [])
		.map(dependency => `import { ${dependency} } from './${dependency}';`)
		.join('');
	return file(
		`${name}.ts`,
		`
		import { Option } from 'fp-ts/lib/Option';
		${dependencies}
		
		export type ${name} = ${serialized.content};
	`,
	);
};

const serializeDefinitionsIndex = (definitions: TDefinitionsObject): TFile =>
	file(
		'definitions.ts',
		Object.keys(definitions)
			.map(name => `export * from './${name}';`)
			.join(''),
	);

// string serializers

const serializeSchemaObjectType = (schema: TSchemaObject): TSerializedSchemObjectWithDependencies => {
	switch (schema.type) {
		case undefined: {
			const reference = `${schema.$ref.replace(/^#\/definitions\//g, '')}`;
			return { content: reference, dependencies: [reference] };
		}
		case 'string': {
			return {
				content: schema.format.fold(schema.type, format => {
					// switch (format) {
					// 	case 'date':
					// 	case 'date-time': {
					// 		return 'Date';
					// 	}
					// }
					return schema.type;
				}),
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
			return { content: `${result.content}[]`, dependencies: result.dependencies };
		}
		case 'object': {
			const serialized = schema.properties.map(properties => {
				const fields = serializeDictionary(properties, (name, value) =>
					serializeField(
						name,
						value,
						schema.required.map(required => required.includes(name)).getOrElse(false),
					),
				);
				const content = fields.map(field => field.content).join('');
				const dependencies = flatten(fields.map(field => field.dependencies || []));
				return {
					content,
					dependencies,
				};
			});
			return {
				content: `{
					${serialized.map(serialized => serialized.content).toUndefined()}
				}`,
				dependencies: serialized.map(serialized => serialized.dependencies).getOrElse([]),
			};
		}
	}
};

const serializeField = (
	name: string,
	schema: TSchemaObject,
	isRequired: boolean,
): TSerializedSchemObjectWithDependencies => {
	const serialized = serializeSchemaObjectType(schema);
	const type = serializeSchemaObjectType(schema).content;
	return {
		content: isRequired ? `${name}: ${type};` : `${name}: Option<${type}>;`,
		dependencies: serialized.dependencies,
	};
};

// serialization helpers

const serializeDictionary = <A, B>(dictionary: Record<string, A>, serializeValue: (name: string, value: A) => B): B[] =>
	Object.keys(dictionary).map(name => serializeValue(name, dictionary[name]));
