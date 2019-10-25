import { BasePathParameterObjectProps } from './base-parameter-object';
import { literal, type } from 'io-ts';

export interface StringPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'string';
}

export const StringPathParameterObject = type(
	{
		...BasePathParameterObjectProps,
		type: literal('string'),
	},
	'StringPathParameterObject',
);
