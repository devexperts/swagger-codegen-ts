import * as t from 'io-ts';
import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { NonArrayItemsObject } from '../../items-object/non-array-items-object';

export interface ArrayQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

export const ArrayQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayQueryParameterObject',
);
