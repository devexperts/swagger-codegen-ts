import { ColorAsset } from './color-asset';
import { Codec } from '../../../utils/io-ts';
import { Color } from './color';
import { Gradient } from './gradient';
import { GradientAsset } from './gradient-asset';
import { ObjectID } from './object-id';
export interface AssetCollection {
    readonly do_objectID: ObjectID;
    readonly colorAssets: ColorAsset[];
    readonly gradientAssets: GradientAsset[];
    readonly colors: Color[];
    readonly gradients: Gradient[];
}
export declare const AssetCollectionCodec: Codec<AssetCollection>;
