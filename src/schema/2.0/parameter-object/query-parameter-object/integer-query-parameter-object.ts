import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import * as t from 'io-ts';

export interface IntegerQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'integer';
}

export const IntegerQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerQueryParameterObject',
);
