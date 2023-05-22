import { Color } from './color';
import { Codec } from '../../../utils/io-ts';
import { ObjectID } from './object-id';
export interface ColorAsset {
    readonly do_objectID: ObjectID;
    readonly name: string;
    readonly color: Color;
}
export declare const ColorAssetCodec: Codec<ColorAsset>;
