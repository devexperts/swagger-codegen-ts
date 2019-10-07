import { BasePathParameterObjectProps } from './base-parameter-object';
import * as t from 'io-ts';
import { NonArrayItemsObject } from '../../items-object/non-array-items-object';

export interface ArrayPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'array';
	readonly items: NonArrayItemsObject;
}

export const ArrayPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('array'),
		items: NonArrayItemsObject,
	},
	'ArrayPathParameterObject',
);
