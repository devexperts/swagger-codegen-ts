import * as t from 'io-ts';
import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';

export interface BooleanItemsObject extends BaseItemsObject {
	readonly type: 'boolean';
}

export const BooleanItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanItemsObject',
);
