import { Gradient } from '../../../../../schema/sketch-121/objects/gradient';
import { PointString } from '../../../../../schema/sketch-121/utils/point-string';
import { Either } from 'fp-ts/lib/Either';
import { serializeGradientStop } from './gradient-stop';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { GradientStop } from '../../../../../schema/sketch-121/objects/gradient-stop';

const serializeGradientStops = (stops: GradientStop[]): Either<Error, string> =>
	pipe(
		stops.map(serializeGradientStop),
		sequenceEither,
		either.map(stops => stops.join(', ')),
	);

const serializeLinearGradient = (gradient: Gradient): Either<Error, string> => {
	const angle = getAngle(gradient.from, gradient.to);
	const stops = serializeGradientStops(gradient.stops);
	return combineEither(stops, stops => `linear-gradient(${angle}deg, ${stops})`);
};

const serializeRadialGradient = (gradient: Gradient): Either<Error, string> => {
	const stops = serializeGradientStops(gradient.stops);
	return combineEither(stops, stops => `radial-gradient(${stops})`);
};

const serializeConicGradient = (gradient: Gradient): Either<Error, string> => {
	const stops = serializeGradientStops(gradient.stops);
	return combineEither(stops, stops => `conic-gradient(${stops})`);
};

export const serializeGradient = (gradient: Gradient): Either<Error, string> => {
	switch (gradient.gradientType) {
		case 0: {
			return serializeLinearGradient(gradient);
		}
		case 1: {
			return serializeRadialGradient(gradient);
		}
		case 2: {
			return serializeConicGradient(gradient);
		}
	}
};

const getAngle = (start: PointString, end: PointString): number =>
	90 - (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
