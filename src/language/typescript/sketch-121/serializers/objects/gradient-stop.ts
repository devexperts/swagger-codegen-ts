import { GradientStop } from '../../../../../schema/sketch-121/objects/gradient-stop';
import { serializeColor } from './color';
import { percentageFromFraction } from '../../../../../utils/io-ts';
import { Either } from 'fp-ts/lib/Either';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';

export const serializeGradientStop = (stop: GradientStop): Either<Error, string> => {
	const color = serializeColor(stop.color);
	const positionInPercents = percentageFromFraction(stop.position);
	return combineEither(positionInPercents, position => `${color} ${position}%`);
};
