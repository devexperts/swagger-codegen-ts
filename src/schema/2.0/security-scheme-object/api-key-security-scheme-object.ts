import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { literal, string, type, union } from 'io-ts';

export interface ApiKeySecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'apiKey';
	readonly in: 'query' | 'header';
	readonly name: string;
}

export const ApiKeySecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('apiKey'),
		in: union([literal('query'), literal('header')]),
		name: string,
	},
	'ApiKeySecuritySchemeObject',
);
