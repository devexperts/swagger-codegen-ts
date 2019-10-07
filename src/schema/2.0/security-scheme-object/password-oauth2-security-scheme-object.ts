import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import * as t from 'io-ts';

export interface PasswordOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'password';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const PasswordOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('password'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'PasswordOAuth2SecuritySchemeObject',
);
