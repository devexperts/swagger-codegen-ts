import { Color, ColorCodec } from './color';
import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { UUID } from 'io-ts-types/lib/UUID';

export interface ColorAsset {
	readonly do_objectID: UUID;
	readonly name: string;
	readonly color: Color;
}

export const ColorAssetCodec: Codec<ColorAsset> = type(
	{
		do_objectID: UUID,
		name: string,
		color: ColorCodec,
	},
	'ColorAsset',
);
