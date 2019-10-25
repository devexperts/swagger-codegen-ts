import { BasePathParameterObjectProps } from './base-parameter-object';
import { NonArrayItemsObject } from '../../items-object/non-array-items-object';
import { literal, type } from 'io-ts';

export interface ArrayPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

export const ArrayPathParameterObject = type(
	{
		...BasePathParameterObjectProps,
		type: literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayPathParameterObject',
);
