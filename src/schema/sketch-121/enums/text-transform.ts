import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type TextTransform = 'None' | 'Uppercase' | 'Lowercase';

export const TextTransformCodec: Codec<TextTransform> = union(
	[mapper('None', 0), mapper('Uppercase', 1), mapper('Lowercase', 2)],
	'TextTransform',
);
