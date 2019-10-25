import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { literal, type } from 'io-ts';

export interface NumberQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'number';
}

export const NumberQueryParameterObject = type(
	{
		...BaseQueryParameterObjectProps,
		type: literal('number'),
	},
	'NumberQueryParameterObject',
);
