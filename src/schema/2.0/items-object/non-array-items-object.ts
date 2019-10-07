import { StringItemsObject } from './string-items-object';
import { NumberItemsObject } from './number-items-object';
import { IntegerItemsObject } from './integer-items-object';
import { BooleanItemsObject } from './boolean-items-object';
import * as t from 'io-ts';

export type NonArrayItemsObject = StringItemsObject | NumberItemsObject | IntegerItemsObject | BooleanItemsObject;

export const NonArrayItemsObject = t.union(
	[StringItemsObject, NumberItemsObject, IntegerItemsObject, BooleanItemsObject],
	'NonArrayItemsObject',
);
