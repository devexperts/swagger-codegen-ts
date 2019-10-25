import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { literal, type } from 'io-ts';

export interface BooleanQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'boolean';
}

export const BooleanQueryParameterObject = type(
	{
		...BaseQueryParameterObjectProps,
		type: literal('boolean'),
	},
	'BooleanQueryParameterObject',
);
