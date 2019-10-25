import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import { literal, type } from 'io-ts';
export interface StringQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'string';
}

export const StringQueryParameterObject = type(
	{
		...BaseQueryParameterObjectProps,
		type: literal('string'),
	},
	'StringQueryParameterObject',
);
