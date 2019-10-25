import { SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import { directory, Directory, file, File } from '../../../../utils/fs';
import { serializeSchemaObject } from './schema-object';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { DefinitionsObject } from '../../../../schema/2.0/definitions-object';
import { serializeDictionary } from '../../../../utils/types';
import { DEFINITIONS_DIRECTORY, getIOName, ROOT_DIRECTORY } from '../../common/utils';

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
