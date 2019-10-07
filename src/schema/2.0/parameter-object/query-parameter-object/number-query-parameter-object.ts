import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import * as t from 'io-ts';

export interface NumberQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'number';
}

export const NumberQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberQueryParameterObject',
);
