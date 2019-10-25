import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import { literal, string, type } from 'io-ts';
export interface AccessCodeOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'accessCode';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const AccessCodeOAuth2SecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('oauth2'),
		flow: literal('accessCode'),
		tokenUrl: string,
		scopes: ScopesObject,
	},
	'AccessCodeOAuth2SecuritySchemeObject',
);
