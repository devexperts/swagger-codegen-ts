import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type TextHorizontalAlignment = 'Left' | 'Right' | 'Centered' | 'Justified' | 'Natural';

export const TextHorizontalAlignmentCodec: Codec<TextHorizontalAlignment> = union(
	[mapper('Left', 0), mapper('Right', 1), mapper('Centered', 2), mapper('Justified', 3), mapper('Natural', 4)],
	'TextHorizontalAlignment',
);
