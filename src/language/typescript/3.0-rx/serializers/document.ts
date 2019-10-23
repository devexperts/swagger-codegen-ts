import { directory, Directory } from '../../../../utils/fs';
import { serializePathsObject } from './paths-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeComponentsObject } from './components-object';
import * as nullable from '../../../../utils/nullable';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { sequenceEither } from '../../../../utils/either';
import { fromString } from '../../../../utils/ref';
import { either } from 'fp-ts';
import { applyTo } from '../../../../utils/function';
import { OpenapiObject } from '../../../../schema/3.0/openapi-object';

const pathsRef = fromString('#/paths');
const componentsRef = fromString('#/components');

export const serializeDocument = combineReader(
	serializePathsObject,
	serializePathsObject => (name: string, document: OpenapiObject): Either<Error, Directory> => {
		const paths = pipe(
			pathsRef,
			either.map(serializePathsObject),
			either.chain(applyTo(document.paths)),
		);

		const components = pipe(
			document.components,
			nullable.map(components =>
				pipe(
					componentsRef,
					either.map(serializeComponentsObject),
					either.chain(applyTo(components)),
				),
			),
		);

		const additional = pipe(
			nullable.compactNullables([components]),
			sequenceEither,
		);
		return combineEither(paths, additional, (paths, additional) => directory(name, [paths, ...additional]));
	},
);
