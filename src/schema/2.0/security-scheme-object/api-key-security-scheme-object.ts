import * as t from 'io-ts';
import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';

export interface ApiKeySecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'apiKey';
	readonly in: 'query' | 'header';
	readonly name: string;
}

export const ApiKeySecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('apiKey'),
		in: t.union([t.literal('query'), t.literal('header')]),
		name: t.string,
	},
	'ApiKeySecuritySchemeObject',
);
