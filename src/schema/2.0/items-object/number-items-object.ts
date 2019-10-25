import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import { literal, type } from 'io-ts';

export interface NumberItemsObject extends BaseItemsObject {
	readonly type: 'number';
}

export const NumberItemsObject = type(
	{
		...BaseItemsObjectProps,
		type: literal('number'),
	},
	'NumberItemsObject',
);
