import { ItemsObject } from './items-object';
import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { stringOption } from '../../utils/io-ts';

export type HeaderObject = ItemsObject & {
	readonly description: Option<string>;
};
export const HeaderObject = t.intersection(
	[
		ItemsObject,
		t.type({
			description: stringOption,
		}),
	],
	'HeaderObject',
);
