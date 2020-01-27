import { SharedStyleContainer, SharedStyleContainerCodec } from './objects/shared-style-container';
import { Codec } from '../../utils/io-ts';
import { array, type } from 'io-ts';
import { SharedTextStyleContainer, SharedTextStyleContainerCodec } from './objects/shared-text-style-container';
import { ForeignLayerStyle, ForeignLayerStyleCodec } from './objects/foreign-layer-style';
import { ForeignTextStyle, ForeignTextStyleCodec } from './objects/foreign-text-style';
import { AssetCollection, AssetCollectionCodec } from './objects/asset-collection';
import { ObjectID, ObjectIDCodec } from './objects/object-id';
import { ForeignSymbol, ForeignSymbolCodec } from './objects/foreign-symbol';

export interface AbstractDocument {
	readonly do_objectID: ObjectID;
	readonly assets: AssetCollection;
	readonly foreignLayerStyles: ForeignLayerStyle[];
	readonly foreignTextStyles: ForeignTextStyle[];
	readonly foreignSymbols: ForeignSymbol[];
	readonly layerTextStyles: SharedTextStyleContainer;
	readonly layerStyles: SharedStyleContainer;
}

export const AbstractDocumentCodec: Codec<AbstractDocument> = type({
	do_objectID: ObjectIDCodec,
	assets: AssetCollectionCodec,
	foreignLayerStyles: array(ForeignLayerStyleCodec),
	foreignTextStyles: array(ForeignTextStyleCodec),
	foreignSymbols: array(ForeignSymbolCodec),
	layerTextStyles: SharedTextStyleContainerCodec,
	layerStyles: SharedStyleContainerCodec,
});
