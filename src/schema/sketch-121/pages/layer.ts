import { Codec } from '../../../utils/io-ts';
import { Style, StyleCodec } from '../objects/style';
import { ObjectID, ObjectIDCodec } from '../objects/object-id';
import { string, type, array, recursion, boolean } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Option } from 'fp-ts/lib/Option';

export interface Layer {
	readonly _class: string;
	readonly do_objectID: ObjectID;
	readonly name: string;
	readonly style: Style;
	readonly layers: Option<Layer[]>;
	readonly isVisible: boolean;
}

export const LayerCodec: Codec<Layer> = recursion('Layer', () =>
	type(
		{
			_class: string,
			do_objectID: ObjectIDCodec,
			name: string,
			style: StyleCodec,
			isVisible: boolean,
			layers: optionFromNullable(array(LayerCodec)),
		},
		'Layer',
	),
);
