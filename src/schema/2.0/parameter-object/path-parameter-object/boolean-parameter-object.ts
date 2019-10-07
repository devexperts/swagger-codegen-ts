import { BasePathParameterObjectProps } from './base-parameter-object';
import * as t from 'io-ts';

export interface BooleanPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'boolean';
}

export const BooleanPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('boolean'),
	},
	'BooleanPathParameterObject',
);
