import { UnitInterval, UnitIntervalCodec } from '../utils/unit-interval';
import { Codec } from '../../../utils/io-ts';
import { boolean, type } from 'io-ts';

export interface ColorControls {
	readonly isEnabled: boolean;
	readonly brightness: UnitInterval;
	readonly contrast: UnitInterval;
	readonly hue: UnitInterval;
	readonly saturation: UnitInterval;
}

export const ColorControlsCodec: Codec<ColorControls> = type(
	{
		isEnabled: boolean,
		brightness: UnitIntervalCodec,
		contrast: UnitIntervalCodec,
		hue: UnitIntervalCodec,
		saturation: UnitIntervalCodec,
	},
	'ColorControls',
);
