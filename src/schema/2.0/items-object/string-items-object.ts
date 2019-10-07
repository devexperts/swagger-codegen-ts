import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import * as t from 'io-ts';

export interface StringItemsObject extends BaseItemsObject {
	readonly type: 'string';
}

export const StringItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('string'),
	},
	'StringItemsObject',
);
