import { Codec } from '../../../utils/io-ts';
import { Style, StyleCodec } from '../objects/style';
import { ObjectID, ObjectIDCodec } from '../objects/object-id';
import { string, type, array } from 'io-ts';
import { Layer, LayerCodec } from './layer';

export interface Page {
	do_objectID: ObjectID;
	name: string;
	style: Style;
	layers: Layer[];
}

export const PageCodec: Codec<Page> = type(
	{
		do_objectID: ObjectIDCodec,
		name: string,
		style: StyleCodec,
		layers: array(LayerCodec),
	},
	'Page',
);
