import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import * as t from 'io-ts';

export interface IntegerItemsObject extends BaseItemsObject {
	readonly type: 'integer';
}

export const IntegerItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('integer'),
	},
	'IntegerItemsObject',
);
