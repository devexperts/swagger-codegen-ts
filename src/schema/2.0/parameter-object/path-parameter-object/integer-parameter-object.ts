import { BasePathParameterObjectProps } from './base-parameter-object';
import { literal, type } from 'io-ts';

export interface IntegerPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'integer';
}

export const IntegerPathParameterObject = type(
	{
		...BasePathParameterObjectProps,
		type: literal('integer'),
	},
	'IntegerPathParameterObject',
);
