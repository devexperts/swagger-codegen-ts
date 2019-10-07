import { BasePathParameterObjectProps } from './base-parameter-object';
import * as t from 'io-ts';

export interface NumberPathParameterObject extends BasePathParameterObjectProps {
	readonly type: 'number';
}

export const NumberPathParameterObject = t.type(
	{
		...BasePathParameterObjectProps,
		type: t.literal('number'),
	},
	'NumberPathParameterObject',
);
