import { UnitInterval, UnitIntervalCodec } from '../utils/unit-interval';
import { Codec } from '../../../utils/io-ts';
import { type } from 'io-ts';

export interface Color {
	readonly alpha: UnitInterval;
	readonly red: UnitInterval;
	readonly green: UnitInterval;
	readonly blue: UnitInterval;
}

export const ColorCodec: Codec<Color> = type(
	{
		alpha: UnitIntervalCodec,
		red: UnitIntervalCodec,
		green: UnitIntervalCodec,
		blue: UnitIntervalCodec,
	},
	'Color',
);
