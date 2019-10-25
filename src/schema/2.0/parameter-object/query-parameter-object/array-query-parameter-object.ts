import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { NonArrayItemsObject } from '../../items-object/non-array-items-object';
import { literal, type } from 'io-ts';

export interface ArrayQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

export const ArrayQueryParameterObject = type(
	{
		...BaseQueryParameterObjectProps,
		type: literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayQueryParameterObject',
);
