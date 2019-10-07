import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import * as t from 'io-ts';

export interface BooleanQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'boolean';
}

export const BooleanQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanQueryParameterObject',
);
