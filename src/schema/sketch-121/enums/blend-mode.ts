import { Codec, mapper } from '../../../utils/io-ts';
import { union } from 'io-ts';

export type BlendMode =
	| 'Normal'
	| 'Darken'
	| 'Multiply'
	| 'Color burn'
	| 'Lighten'
	| 'Screen'
	| 'Color dodge'
	| 'Overlay'
	| 'Soft light'
	| 'Hard light'
	| 'Difference'
	| 'Exclusion'
	| 'Hue'
	| 'Saturation'
	| 'Color'
	| 'Luminosity'
	| 'Plus darker'
	| 'Plus lighter';

export const BlendModeCodec: Codec<BlendMode> = union(
	[
		mapper('Normal', 0),
		mapper('Darken', 1),
		mapper('Multiply', 2),
		mapper('Color burn', 3),
		mapper('Lighten', 4),
		mapper('Screen', 5),
		mapper('Color dodge', 6),
		mapper('Overlay', 7),
		mapper('Soft light', 8),
		mapper('Hard light', 9),
		mapper('Difference', 10),
		mapper('Exclusion', 11),
		mapper('Hue', 12),
		mapper('Saturation', 13),
		mapper('Color', 14),
		mapper('Luminosity', 15),
		mapper('Plus darker', 16),
		mapper('Plus lighter', 17),
	],
	'BlendMode',
);
