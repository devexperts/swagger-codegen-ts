import { Layer } from './layer';
import { ObjectID } from './object-id';
import { Codec } from '../../../utils/io-ts';
export interface ForeignSymbol {
    do_objectID: ObjectID;
    originalMaster: Layer;
    symbolMaster: Layer;
}
export declare const ForeignSymbolCodec: Codec<ForeignSymbol>;
