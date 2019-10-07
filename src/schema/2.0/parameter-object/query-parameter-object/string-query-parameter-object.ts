import { BaseQueryParameterObjectProps } from './base-query-parameter-object';
import * as t from 'io-ts';

export interface StringQueryParameterObject extends BaseQueryParameterObjectProps {
	readonly type: 'string';
}

export const StringQueryParameterObject = t.type(
	{
		...BaseQueryParameterObjectProps,
		type: t.literal('string'),
	},
	'StringQueryParameterObject',
);
