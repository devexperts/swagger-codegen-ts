import { BaseItemsObject, BaseItemsObjectProps } from './base-items-object';
import * as t from 'io-ts';

export interface NumberItemsObject extends BaseItemsObject {
	readonly type: 'number';
}

export const NumberItemsObject = t.type(
	{
		...BaseItemsObjectProps,
		type: t.literal('number'),
	},
	'NumberItemsObject',
);
