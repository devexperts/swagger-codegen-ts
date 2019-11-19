import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { UUID } from 'io-ts-types/lib/UUID';
import { Style, StyleCodec } from './style';

export interface SharedStyle {
	readonly do_objectID: UUID;
	readonly name: string;
	readonly value: Style;
}

export const SharedStyleCodec: Codec<SharedStyle> = type(
	{
		name: string,
		do_objectID: UUID,
		value: StyleCodec,
	},
	'SharedStyle',
);
