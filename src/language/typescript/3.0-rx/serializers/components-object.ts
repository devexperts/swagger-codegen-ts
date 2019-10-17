import { OpenAPIV3 } from 'openapi-types';
import { Either, left } from 'fp-ts/lib/Either';
import { directory, Directory, File, file } from '../../../../fs';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import * as nullable from '../../../../utils/nullable';
import { isReferenceObject } from './reference-object';
import { serializeDictionary } from '../../../../utils/types';
import { sequenceEither } from '../../../../utils/either';
import { either } from 'fp-ts';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { getIOName, getTypeName } from '../../common/utils';
import { compactNullables } from '../../../../utils/nullable';

const serializeSchema = (name: string, schema: OpenAPIV3.SchemaObject, cwd: string): Either<Error, File> => {
	const serialized = pipe(
		schema,
		serializeSchemaObject(name, cwd),
	);
	const dependencies = pipe(
		serialized,
		either.map(serialized => serializeDependencies(serialized.dependencies)),
	);
	return combineEither(serialized, dependencies, (serialized, dependencies) =>
		file(
			`${name}.ts`,
			`
			${dependencies}
			
			export type ${getTypeName(name)} = ${serialized.type};
			export const ${getIOName(name)} = ${serialized.io};
		`,
		),
	);
};

export const serializeComponentsObject = (componentsObject: OpenAPIV3.ComponentsObject): Either<Error, Directory> => {
	const schemas = pipe(
		componentsObject.schemas,
		nullable.map(schemas =>
			pipe(
				serializeDictionary(schemas, (name, schema) => {
					if (isReferenceObject(schema)) {
						return left(
							new Error('References inside ComponentsObject.schemas dictionary are not supported yet'),
						);
					} else {
						return serializeSchema(name, schema, `./components/schemas`);
					}
				}),
				sequenceEither,
				either.map(content => directory('schemas', content)),
			),
		),
	);
	return pipe(
		compactNullables([schemas]),
		sequenceEither,
		either.map(content => directory('components', content)),
	);
};
