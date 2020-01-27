import { type } from 'io-ts';
import { Layer, LayerCodec } from './layer';
import { ObjectID, ObjectIDCodec } from './object-id';
import { Codec } from '../../../utils/io-ts';

export interface ForeignSymbol {
	do_objectID: ObjectID;
	originalMaster: Layer;
	symbolMaster: Layer;
}

export const ForeignSymbolCodec: Codec<ForeignSymbol> = type(
	{
		do_objectID: ObjectIDCodec,
		originalMaster: LayerCodec,
		symbolMaster: LayerCodec,
	},
	'ForeignSymbol',
);
