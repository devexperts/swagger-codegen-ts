import { SharedStyleContainer } from './objects/shared-style-container';
import { Codec } from '../../utils/io-ts';
import { SharedTextStyleContainer } from './objects/shared-text-style-container';
import { ForeignLayerStyle } from './objects/foreign-layer-style';
import { ForeignTextStyle } from './objects/foreign-text-style';
import { AssetCollection } from './objects/asset-collection';
import { ObjectID } from './objects/object-id';
import { ForeignSymbol } from './objects/foreign-symbol';
export interface AbstractDocument {
    readonly do_objectID: ObjectID;
    readonly assets: AssetCollection;
    readonly foreignLayerStyles: ForeignLayerStyle[];
    readonly foreignTextStyles: ForeignTextStyle[];
    readonly foreignSymbols: ForeignSymbol[];
    readonly layerTextStyles: SharedTextStyleContainer;
    readonly layerStyles: SharedStyleContainer;
}
export declare const AbstractDocumentCodec: Codec<AbstractDocument>;
