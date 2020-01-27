import { Codec } from '../../utils/io-ts';
import { literal, type, union } from 'io-ts';

export interface Meta {
	readonly version: 121 | 122 | 123;
}

export const MetaCodec: Codec<Meta> = type(
	{
		version: union([literal(121), literal(122), literal(123)]),
	},
	'Meta',
);
