import { ItemsObject } from './items-object/items-object';
import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../utils/io-ts';
import { intersection, type } from 'io-ts';

export type HeaderObject = ItemsObject & {
	readonly description: Option<string>;
};
export const HeaderObject = intersection(
	[
		ItemsObject,
		type({
			description: stringOption,
		}),
	],
	'HeaderObject',
);
