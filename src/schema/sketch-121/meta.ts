import { Codec } from '../../utils/io-ts';
import { literal, type } from 'io-ts';

export interface Meta {
	readonly version: 121;
}

export const MetaCodec: Codec<Meta> = type(
	{
		version: literal(121),
	},
	'Meta',
);
