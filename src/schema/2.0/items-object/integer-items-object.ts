import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import { literal, type } from 'io-ts';

export interface IntegerItemsObject extends BaseItemsObject {
	readonly type: 'integer';
}

export const IntegerItemsObject = type(
	{
		...BaseItemsObjectProps,
		type: literal('integer'),
	},
	'IntegerItemsObject',
);
