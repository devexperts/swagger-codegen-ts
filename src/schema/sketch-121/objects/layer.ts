import { Codec } from '../../../utils/io-ts';
import { Style, StyleCodec } from './style';
import { ObjectID, ObjectIDCodec } from './object-id';
import { string, type, array, recursion, boolean } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Option } from 'fp-ts/lib/Option';
import { OverrideValue, OverrideValueCodec } from './override-value';
import { LayerClass, LayerClassCodec } from '../enums/layer-class';

export interface Layer {
	readonly _class: LayerClass;
	readonly do_objectID: ObjectID;
	readonly name: string;
	readonly style: Style;
	readonly layers: Option<Layer[]>;
	readonly isVisible: boolean;
	readonly overrideValues: Option<OverrideValue[]>;
	readonly sharedStyleID: Option<ObjectID>;
	readonly symbolID: Option<ObjectID>;
}

export const LayerCodec: Codec<Layer> = recursion('Layer', () =>
	type(
		{
			_class: LayerClassCodec,
			do_objectID: ObjectIDCodec,
			name: string,
			style: StyleCodec,
			isVisible: boolean,
			layers: optionFromNullable(array(LayerCodec)),
			overrideValues: optionFromNullable(array(OverrideValueCodec)),
			sharedStyleID: optionFromNullable(ObjectIDCodec),
			symbolID: optionFromNullable(ObjectIDCodec),
		},
		'Layer',
	),
);
