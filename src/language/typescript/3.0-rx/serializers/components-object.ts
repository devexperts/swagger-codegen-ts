import { OpenAPIV3 } from 'openapi-types';
import { Either, left } from 'fp-ts/lib/Either';
import { directory, Directory, File, file } from '../../../../utils/fs';
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
import { addPathParts, Ref } from '../../../../utils/ref';
import { applyTo } from '../../../../utils/function';

const serializeSchema = (from: Ref) => (schema: OpenAPIV3.SchemaObject): Either<Error, File> => {
	const typeName = getTypeName(from.name);
	const ioName = getIOName(from.name);
	const serialized = pipe(
		schema,
		serializeSchemaObject(from, typeName),
	);
	const dependencies = pipe(
		serialized,
		either.map(serialized => serializeDependencies(serialized.dependencies)),
	);
	return combineEither(serialized, dependencies, (serialized, dependencies) =>
		file(
			`${from.name}.ts`,
			`
			${dependencies}
			
			export type ${typeName} = ${serialized.type};
			export const ${ioName} = ${serialized.io};
		`,
		),
	);
};

export const serializeComponentsObject = (from: Ref) => (
	componentsObject: OpenAPIV3.ComponentsObject,
): Either<Error, Directory> => {
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
						return pipe(
							from,
							addPathParts('schemas', name),
							either.map(serializeSchema),
							either.chain(applyTo(schema)),
						);
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
