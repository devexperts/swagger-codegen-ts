import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import { literal, type } from 'io-ts';

export interface StringItemsObject extends BaseItemsObject {
	readonly type: 'string';
}

export const StringItemsObject = type(
	{
		...BaseItemsObjectProps,
		type: literal('string'),
	},
	'StringItemsObject',
);
