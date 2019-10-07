import * as t from 'io-ts';
import { BasePathParameterObjectProps } from './base-parameter-object';

export interface IntegerPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'integer';
}

export const IntegerPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('integer'),
	},
	'IntegerPathParameterObject',
);
