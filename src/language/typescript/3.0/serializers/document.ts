import { directory, Directory } from '../../../../utils/fs';
import { serializePathsObject } from './paths-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeComponentsObject } from './components-object';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { fromString } from '../../../../utils/ref';
import { array, either, option } from 'fp-ts';
import { applyTo } from '../../../../utils/function';
import { OpenapiObject } from '../../../../schema/3.0/openapi-object';
import { pathsRef } from '../../common/utils';
import { clientFile } from '../../common/bundled/client';
import { utilsFile } from '../../common/bundled/utils';
import { openapi3utilsFile } from '../bundled/openapi-3-utils';

export const serializeDocument = combineReader(
	serializeComponentsObject,
	serializePathsObject,
	(serializeComponentsObject, serializePathsObject) => (
		name: string,
		document: OpenapiObject,
	): Either<Error, Directory> => {
		const componentsRef = fromString('#/components');

		const paths = pipe(
			pathsRef,
			either.map(serializePathsObject),
			either.chain(applyTo(document.paths)),
		);

		const components = pipe(
			document.components,
			option.map(components =>
				pipe(
					componentsRef,
					either.map(serializeComponentsObject),
					either.chain(applyTo(components)),
				),
			),
		);

		const additional = pipe(
			array.compact([components]),
			sequenceEither,
		);
		return combineEither(
			paths,
			additional,
			clientFile,
			utilsFile,
			openapi3utilsFile,
			(paths, additional, clientFile, utilsFile, openapi3utilsFile) =>
				directory(name, [paths, ...additional, clientFile, utilsFile, openapi3utilsFile]),
		);
	},
);
