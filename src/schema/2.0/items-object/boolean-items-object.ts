import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import { literal, type } from 'io-ts';

export interface BooleanItemsObject extends BaseItemsObject {
	readonly type: 'boolean';
}

export const BooleanItemsObject = type(
	{
		...BaseItemsObjectProps,
		type: literal('boolean'),
	},
	'BooleanItemsObject',
);
