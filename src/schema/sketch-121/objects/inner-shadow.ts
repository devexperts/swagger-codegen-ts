import { Color, ColorCodec } from './color';
import { Codec } from '../../../utils/io-ts';
import { boolean, number, type } from 'io-ts';

export interface InnerShadow {
	readonly isEnabled: boolean;
	readonly blurRadius: number;
	readonly color: Color;
	readonly offsetX: number;
	readonly offsetY: number;
	readonly spread: number;
}

export const InnerShadowCodec: Codec<InnerShadow> = type(
	{
		isEnabled: boolean,
		blurRadius: number,
		color: ColorCodec,
		offsetX: number,
		offsetY: number,
		spread: number,
	},
	'InnerShadow',
);
