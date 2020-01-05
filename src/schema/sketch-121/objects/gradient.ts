import { GradientType, GradientTypeCodec } from '../enums/gradient-type';
import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { PointString, PointStringCodec } from '../utils/point-string';
import { GradientStop, GradientStopCodec } from './gradient-stop';

export interface Gradient {
	readonly gradientType: GradientType;
	readonly from: PointString;
	readonly to: PointString;
	readonly stops: GradientStop[];
}

export const GradientCodec: Codec<Gradient> = type(
	{
		gradientType: GradientTypeCodec,
		from: PointStringCodec,
		to: PointStringCodec,
		stops: array(GradientStopCodec),
	},
	'Gradient',
);
