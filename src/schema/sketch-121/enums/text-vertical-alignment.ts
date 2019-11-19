import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type TextVerticalAlignment = 'Top' | 'Middle' | 'Bottom';

export const TextVerticalAlignmentCodec: Codec<TextVerticalAlignment> = union(
	[mapper('Top', 0), mapper('Middle', 1), mapper('Bottom', 2)],
	'TextVerticalAlignment',
);
