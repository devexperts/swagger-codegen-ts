import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSharedStyle } from './shared-style';
import { either, nonEmptyArray, option } from 'fp-ts';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { SharedTextStyleContainer } from '../../../../../schema/sketch-121/objects/shared-text-style-container';
import { Option } from 'fp-ts/lib/Option';
import { traverseNEAEither } from '../../../../../utils/either';
import { sequenceOptionEither } from '../../../../../utils/option';

export const serializeSharedTextStyleContainer = combineReader(
	serializeSharedStyle,
	serializeSharedStyle => (sharedTextStyleContainer: SharedTextStyleContainer): Either<Error, Option<string>> =>
		pipe(
			nonEmptyArray.fromArray(sharedTextStyleContainer.objects),
			option.map(objects =>
				pipe(
					traverseNEAEither(objects, serializeSharedStyle),
					either.map(values => values.join('')),
				),
			),
			sequenceOptionEither,
		),
);
