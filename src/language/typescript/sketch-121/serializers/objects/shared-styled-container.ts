import { SharedStyleContainer } from '../../../../../schema/sketch-121/objects/shared-style-container';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSharedStyle } from './shared-style';
import { either, nonEmptyArray, option } from 'fp-ts';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { traverseNEAEither } from '../../../../../utils/either';
import { Option } from 'fp-ts/lib/Option';
import { sequenceOptionEither } from '../../../../../utils/option';

export const serializeSharedStyleContainer = combineReader(
	serializeSharedStyle,
	serializeSharedStyle => (sharedStyleContainer: SharedStyleContainer): Either<Error, Option<string>> =>
		pipe(
			nonEmptyArray.fromArray(sharedStyleContainer.objects),
			option.map(objects =>
				pipe(
					traverseNEAEither(objects, serializeSharedStyle),
					either.map(styles => styles.join('')),
				),
			),
			sequenceOptionEither,
		),
);
