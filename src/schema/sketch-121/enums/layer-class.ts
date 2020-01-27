import { literal, union } from 'io-ts';
import { Codec } from '../../../utils/io-ts';

export type LayerClass =
	| 'symbolInstance'
	| 'symbolMaster'
	| 'group'
	| 'oval'
	| 'text'
	| 'rectangle'
	| 'shapePath'
	| 'shapeGroup'
	| 'artboard';

export const LayerClassCodec: Codec<LayerClass> = union(
	[
		literal('symbolInstance'),
		literal('symbolMaster'),
		literal('group'),
		literal('oval'),
		literal('text'),
		literal('rectangle'),
		literal('shapePath'),
		literal('shapeGroup'),
		literal('artboard'),
	],
	'LayerClass',
);
