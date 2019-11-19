import { SharedStyleContainer, SharedStyleContainerCodec } from './objects/shared-style-container';
import { Codec } from '../../utils/io-ts';
import { array, type } from 'io-ts';
import { SharedTextStyleContainer, SharedTextStyleContainerCodec } from './objects/shared-text-style-container';
import { ForeignLayerStyle, ForeignLayerStyleCodec } from './objects/foreign-layer-style';
import { ForeignTextStyle, ForeignTextStyleCodec } from './objects/foreign-text-style';

export interface AbstractDocument {
	readonly foreignLayerStyles: ForeignLayerStyle[];
	readonly foreignTextStyles: ForeignTextStyle[];
	readonly layerTextStyles: SharedTextStyleContainer;
	readonly layerStyles: SharedStyleContainer;
}

export const AbstractDocumentCodec: Codec<AbstractDocument> = type({
	foreignLayerStyles: array(ForeignLayerStyleCodec),
	foreignTextStyles: array(ForeignTextStyleCodec),
	layerTextStyles: SharedTextStyleContainerCodec,
	layerStyles: SharedStyleContainerCodec,
});
