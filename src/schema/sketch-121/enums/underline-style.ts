import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type UnderlineStyle = 'None' | 'Underlined';

export const UnderlineStyleCodec: Codec<UnderlineStyle> = union(
	[mapper('None', 0), mapper('Underlined', 1)],
	'UnderlineStyle',
);
