import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type BorderPosition = 'Center' | 'Inside' | 'Outside';

export const BorderPositionCodec: Codec<BorderPosition> = union(
	[mapper('Center', 0), mapper('Inside', 1), mapper('Outside', 2)],
	'BorderPosition',
);
