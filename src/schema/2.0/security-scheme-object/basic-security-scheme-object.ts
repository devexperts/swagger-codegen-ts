import * as t from 'io-ts';
import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';

export interface BasicSecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'basic';
}

export const BasicSecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('basic'),
	},
	'BasicSecuritySchemeObject',
);
