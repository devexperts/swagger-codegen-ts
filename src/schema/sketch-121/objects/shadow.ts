import { Codec } from '../../../utils/io-ts';
import { boolean, number, type } from 'io-ts';
import { Color, ColorCodec } from './color';

export interface Shadow {
	readonly isEnabled: boolean;
	readonly blurRadius: number;
	readonly color: Color;
	readonly offsetX: number;
	readonly offsetY: number;
	readonly spread: number;
}

export const ShadowCodec: Codec<Shadow> = type(
	{
		isEnabled: boolean,
		blurRadius: number,
		color: ColorCodec,
		offsetX: number,
		offsetY: number,
		spread: number,
	},
	'Shadow',
);
