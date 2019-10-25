import { BasePathParameterObjectProps } from './base-parameter-object';
import { literal, type } from 'io-ts';

export interface NumberPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'number';
}

export const NumberPathParameterObject = type(
	{
		...BasePathParameterObjectProps,
		type: literal('number'),
	},
	'NumberPathParameterObject',
);
