import { SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import { directory, Directory, file, File } from '../../../../utils/fs';
import { serializeSchemaObject } from './schema-object';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { DefinitionsObject } from '../../../../schema/2.0/definitions-object';
import { DEFINITIONS_DIRECTORY, getIOName, ROOT_DIRECTORY } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';

export const serializeDefinitions = (definitions: DefinitionsObject): Either<Error, Directory> =>
	pipe(
		definitions,
		record.collect((name, definition) =>
			serializeDefinition(name, definition, `${ROOT_DIRECTORY}/${DEFINITIONS_DIRECTORY}`),
		),
		sequenceEither,
		either.map(serialized => directory(DEFINITIONS_DIRECTORY, serialized)),
	);

const serializeDefinition = (name: string, definition: SchemaObject, cwd: string): Either<Error, File> =>
	pipe(
		serializeSchemaObject(definition, name, cwd),
		either.map(serialized => {
			const dependencies = serializeDependencies(serialized.dependencies);
			return file(
				`${name}.ts`,
				`
					${dependencies}
					
					export type ${name} = ${serialized.type};
					export const ${getIOName(name)} = ${serialized.io};
				`,
			);
		}),
	);
