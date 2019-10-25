import { BasePathParameterObjectProps } from './base-parameter-object';
import { literal, type } from 'io-ts';

export interface BooleanPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'boolean';
}

export const BooleanPathParameterObject = type(
	{
		...BasePathParameterObjectProps,
		type: literal('boolean'),
	},
	'BooleanPathParameterObject',
);
