import { UUID } from 'io-ts-types/lib/UUID';
import { ColorAsset, ColorAssetCodec } from './color-asset';
import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { Color, ColorCodec } from './color';
import { Gradient, GradientCodec } from './gradient';
import { GradientAsset, GradientAssetCodec } from './gradient-asset';

export interface AssetCollection {
	readonly do_objectID: UUID;
	readonly colorAssets: ColorAsset[];
	readonly gradientAssets: GradientAsset[];
	readonly colors: Color[];
	readonly gradients: Gradient[];
}

export const AssetCollectionCodec: Codec<AssetCollection> = type({
	do_objectID: UUID,
	colorAssets: array(ColorAssetCodec),
	gradientAssets: array(GradientAssetCodec),
	colors: array(ColorCodec),
	gradients: array(GradientCodec),
});
