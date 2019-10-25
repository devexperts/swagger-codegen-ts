import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { literal, type } from 'io-ts';

export interface BasicSecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'basic';
}

export const BasicSecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('basic'),
	},
	'BasicSecuritySchemeObject',
);
