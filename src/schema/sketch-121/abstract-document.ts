import { SharedStyleContainer, SharedStyleContainerCodec } from './objects/shared-style-container';
import { Codec } from '../../utils/io-ts';
import { array, type } from 'io-ts';
import { SharedTextStyleContainer, SharedTextStyleContainerCodec } from './objects/shared-text-style-container';
import { ForeignLayerStyle, ForeignLayerStyleCodec } from './objects/foreign-layer-style';
import { ForeignTextStyle, ForeignTextStyleCodec } from './objects/foreign-text-style';
import { UUID } from 'io-ts-types/lib/UUID';
import { AssetCollection, AssetCollectionCodec } from './objects/asset-collection';

export interface AbstractDocument {
	readonly do_objectID: UUID;
	readonly assets: AssetCollection;
	readonly foreignLayerStyles: ForeignLayerStyle[];
	readonly foreignTextStyles: ForeignTextStyle[];
	readonly layerTextStyles: SharedTextStyleContainer;
	readonly layerStyles: SharedStyleContainer;
}

export const AbstractDocumentCodec: Codec<AbstractDocument> = type({
	do_objectID: UUID,
	assets: AssetCollectionCodec,
	foreignLayerStyles: array(ForeignLayerStyleCodec),
	foreignTextStyles: array(ForeignTextStyleCodec),
	layerTextStyles: SharedTextStyleContainerCodec,
	layerStyles: SharedStyleContainerCodec,
});
