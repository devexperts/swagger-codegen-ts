import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import { literal, string, type } from 'io-ts';
export interface PasswordOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'password';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const PasswordOAuth2SecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('oauth2'),
		flow: literal('password'),
		tokenUrl: string,
		scopes: ScopesObject,
	},
	'PasswordOAuth2SecuritySchemeObject',
);
