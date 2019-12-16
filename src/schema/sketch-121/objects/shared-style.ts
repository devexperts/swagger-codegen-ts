import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { Style, StyleCodec } from './style';
import { ObjectID, ObjectIDCodec } from './object-id';

export interface SharedStyle {
	readonly do_objectID: ObjectID;
	readonly name: string;
	readonly value: Style;
}

export const SharedStyleCodec: Codec<SharedStyle> = type(
	{
		name: string,
		do_objectID: ObjectIDCodec,
		value: StyleCodec,
	},
	'SharedStyle',
);
