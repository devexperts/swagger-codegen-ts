import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type FillType = 'Color' | 'Gradient' | 'Pattern';

export const FillTypeCodec: Codec<FillType> = union(
	[mapper('Color', 0), mapper('Gradient', 1), mapper('Pattern', 2)],
	'FillType',
);
