import { Codec } from '../../../utils/io-ts';
import { Style } from './style';
import { ObjectID } from './object-id';
import { Layer } from './layer';
export interface Page {
    do_objectID: ObjectID;
    name: string;
    style: Style;
    layers: Layer[];
}
export declare const PageCodec: Codec<Page>;
