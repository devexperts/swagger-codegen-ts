import { literal, union } from 'io-ts';
import { Codec } from '../../../utils/io-ts';

export type GradientType = 0 | 1 | 2;

export const GradientTypeCodec: Codec<GradientType> = union(
	[literal(0, 'Linear'), literal(1, 'Radial'), literal(2, 'Angular')],
	'GradientType',
);
