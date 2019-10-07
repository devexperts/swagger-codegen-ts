import * as t from 'io-ts';
import { BasePathParameterObjectProps } from './base-parameter-object';

export interface StringPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'string';
}

export const StringPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('string'),
	},
	'StringPathParameterObject',
);
