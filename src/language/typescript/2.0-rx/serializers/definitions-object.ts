import { SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import { directory, Directory, file, File } from '../../../../fs';
import { serializeSchemaObject } from './schema-object';
import { serializeDependencies } from '../data/serialized-dependency';
import { DEFINITIONS_DIRECTORY, getIOName, ROOT_DIRECTORY } from '../utils';
import { DefinitionsObject } from '../../../../schema/2.0/definitions-object';
import { serializeDictionary } from '../../../../utils/types';

export const serializeDefinitions = (definitions: DefinitionsObject): Directory =>
	directory(DEFINITIONS_DIRECTORY, [
		...serializeDictionary(definitions, (name, definition) =>
			serializeDefinition(name, definition, `${ROOT_DIRECTORY}/${DEFINITIONS_DIRECTORY}`),
		),
	]);

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
