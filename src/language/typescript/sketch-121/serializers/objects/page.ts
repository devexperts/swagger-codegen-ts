import { Page } from '../../../../../schema/sketch-121/objects/page';
import { either } from 'fp-ts';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeLayer } from './layer';
import { traverseArrayEither } from '../../../../../utils/either';
import { Either } from 'fp-ts/lib/Either';

export const serializePage = combineReader(serializeLayer, serializeLayer => (page: Page): Either<Error, string> =>
	pipe(
		traverseArrayEither(page.layers, serializeLayer),
		either.map(styles => styles.join('')),
	),
);
