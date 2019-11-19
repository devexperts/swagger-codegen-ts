import { Color, ColorCodec } from './color';
import { UnitInterval, UnitIntervalCodec } from '../utils/unit-interval';
import { Codec } from '../../../utils/io-ts';
import { type } from 'io-ts';

export interface GradientStop {
	readonly color: Color;
	readonly position: UnitInterval;
}

export const GradientStopCodec: Codec<GradientStop> = type(
	{
		color: ColorCodec,
		position: UnitIntervalCodec,
	},
	'GradientStopCodec',
);
