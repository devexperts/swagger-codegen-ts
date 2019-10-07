import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as t from 'io-ts';
import { BaseItemsObjectProps } from './base-items-object';
import { StringItemsObject } from './string-items-object';
import { NumberItemsObject } from './number-items-object';
import { IntegerItemsObject } from './integer-items-object';
import { BooleanItemsObject } from './boolean-items-object';
import { ArrayItemsObject } from './array-items-object';

export type ItemsObject =
	| ArrayItemsObject
	| StringItemsObject
	| NumberItemsObject
	| IntegerItemsObject
	| BooleanItemsObject;

export const ItemsObject: t.Type<ItemsObject, unknown> = t.recursion('ItemsObject', ItemsObject => {
	const ArrayItemsObject = t.type({
		...BaseItemsObjectProps,
		type: t.literal('array'),
		items: optionFromNullable(t.array(ItemsObject)),
	});
	return t.union([ArrayItemsObject, StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject]);
});
