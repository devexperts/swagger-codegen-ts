import { directory, Directory } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeDefinitions } from './definitions-object';
import { serializePaths } from './paths-object';
import { pathsRef } from '../../common/utils';
import { Either } from 'fp-ts/lib/Either';
import { array, either, option } from 'fp-ts';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { SwaggerObject } from '../../../../schema/2.0/swagger-object';
import { fromString } from '../../../../utils/ref';
import { clientFile } from '../../common/client';

const definitionsRef = fromString('#/definitions');

export const serializeSwaggerObject = (name: string, swaggerObject: SwaggerObject): Either<Error, Directory> => {
	const definitions = pipe(
		swaggerObject.definitions,
		option.map(definitions =>
			pipe(
				definitionsRef,
				either.chain(from => serializeDefinitions(from, definitions)),
			),
		),
	);
	const additional = pipe(
		[definitions],
		array.compact,
		sequenceEither,
	);
	const paths = pipe(
		pathsRef,
		either.chain(from => serializePaths(from, swaggerObject.paths, swaggerObject.parameters)),
	);
	return combineEither(additional, paths, clientFile, (additional, paths, clientFile) => {
		return directory(name, [clientFile, ...additional, paths]);
	});
};
