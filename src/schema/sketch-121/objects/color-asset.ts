import { Color, ColorCodec } from './color';
import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { ObjectID, ObjectIDCodec } from './object-id';

export interface ColorAsset {
	readonly do_objectID: ObjectID;
	readonly name: string;
	readonly color: Color;
}

export const ColorAssetCodec: Codec<ColorAsset> = type(
	{
		do_objectID: ObjectIDCodec,
		name: string,
		color: ColorCodec,
	},
	'ColorAsset',
);
