import { Codec, nonNegative, NonNegative } from '../../../utils/io-ts';
import { boolean, type } from 'io-ts';
import { Color, ColorCodec } from './color';
import { FillType, FillTypeCodec } from '../enums/fill-type';
import { BorderPosition, BorderPositionCodec } from '../enums/border-position';
import { GraphicsContextSettings, GraphicsContextSettingsCodec } from './graphics-context-settings';
import { Gradient, GradientCodec } from './gradient';

export interface Border {
	readonly isEnabled: boolean;
	readonly color: Color;
	readonly fillType: FillType;
	readonly position: BorderPosition;
	readonly thickness: NonNegative;
	readonly contextSettings: GraphicsContextSettings;
	readonly gradient: Gradient;
}

export const BorderCodec: Codec<Border> = type(
	{
		isEnabled: boolean,
		color: ColorCodec,
		fillType: FillTypeCodec,
		position: BorderPositionCodec,
		thickness: nonNegative,
		contextSettings: GraphicsContextSettingsCodec,
		gradient: GradientCodec,
	},
	'Border',
);
