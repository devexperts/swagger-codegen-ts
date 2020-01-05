import { ColorAsset, ColorAssetCodec } from './color-asset';
import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { Color, ColorCodec } from './color';
import { Gradient, GradientCodec } from './gradient';
import { GradientAsset, GradientAssetCodec } from './gradient-asset';
import { ObjectID, ObjectIDCodec } from './object-id';

export interface AssetCollection {
	readonly do_objectID: ObjectID;
	readonly colorAssets: ColorAsset[];
	readonly gradientAssets: GradientAsset[];
	readonly colors: Color[];
	readonly gradients: Gradient[];
}

export const AssetCollectionCodec: Codec<AssetCollection> = type({
	do_objectID: ObjectIDCodec,
	colorAssets: array(ColorAssetCodec),
	gradientAssets: array(GradientAssetCodec),
	colors: array(ColorCodec),
	gradients: array(GradientCodec),
});
