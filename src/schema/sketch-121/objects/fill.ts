import { Codec } from '../../../utils/io-ts';
import { boolean, type } from 'io-ts';
import { Color, ColorCodec } from './color';
import { Gradient, GradientCodec } from './gradient';
import { FillType, FillTypeCodec } from '../enums/fill-type';
import { GraphicsContextSettings, GraphicsContextSettingsCodec } from './graphics-context-settings';

export interface Fill {
	readonly isEnabled: boolean;
	readonly color: Color;
	readonly fillType: FillType;
	readonly contextSettings: GraphicsContextSettings;
	readonly gradient: Gradient;
}

export const FillCodec: Codec<Fill> = type(
	{
		isEnabled: boolean,
		color: ColorCodec,
		fillType: FillTypeCodec,
		contextSettings: GraphicsContextSettingsCodec,
		gradient: GradientCodec,
	},
	'Fill',
);
