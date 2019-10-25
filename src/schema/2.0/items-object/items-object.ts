import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { BaseItemsObjectProps } from './base-items-object';
import { StringItemsObject } from './string-items-object';
import { NumberItemsObject } from './number-items-object';
import { IntegerItemsObject } from './integer-items-object';
import { BooleanItemsObject } from './boolean-items-object';
import { ArrayItemsObject } from './array-items-object';
import { Codec } from '../../../utils/io-ts';
import { array, literal, recursion, type, union } from 'io-ts';

export type ItemsObject =
	| ArrayItemsObject
	| StringItemsObject
	| NumberItemsObject
	| IntegerItemsObject
	| BooleanItemsObject;

export const ItemsObject: Codec<ItemsObject> = recursion('ItemsObject', ItemsObject => {
	const ArrayItemsObject = type({
		...BaseItemsObjectProps,
		type: literal('array'),
		items: optionFromNullable(array(ItemsObject)),
	});
	return union([ArrayItemsObject, StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject]);
});
