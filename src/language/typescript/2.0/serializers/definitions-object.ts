import { SchemaObject } from '../../../../schema/2.0/schema-object/schema-object';
import { directory, Directory, file, File } from '../../../../utils/fs';
import { serializeSchemaObject } from './schema-object';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { DefinitionsObject } from '../../../../schema/2.0/definitions-object';
import { DEFINITIONS_DIRECTORY, getIOName } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { addPathParts, Ref } from '../../../../utils/ref';

export const serializeDefinitions = (from: Ref, definitions: DefinitionsObject): Either<Error, Directory> =>
	pipe(
		definitions,
		record.collect((name, definition) =>
			pipe(
				from,
				addPathParts(name),
				either.chain(from => serializeDefinition(from, name, definition)),
			),
		),
		sequenceEither,
		either.map(serialized => directory(DEFINITIONS_DIRECTORY, serialized)),
	);

const serializeDefinition = (from: Ref, name: string, definition: SchemaObject): Either<Error, File> =>
	pipe(
		serializeSchemaObject(from, definition),
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
