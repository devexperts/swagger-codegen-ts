import { Gradient } from './gradient';
import { Codec } from '../../../utils/io-ts';
import { ObjectID } from './object-id';
export interface GradientAsset {
    readonly do_objectID: ObjectID;
    readonly name: string;
    readonly gradient: Gradient;
}
export declare const GradientAssetCodec: Codec<GradientAsset>;
