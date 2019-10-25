import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { literal, type } from 'io-ts';

export interface IntegerQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'integer';
}

export const IntegerQueryParameterObject = type(
	{
		...BaseQueryParameterObjectProps,
		type: literal('integer'),
	},
	'IntegerQueryParameterObject',
);
