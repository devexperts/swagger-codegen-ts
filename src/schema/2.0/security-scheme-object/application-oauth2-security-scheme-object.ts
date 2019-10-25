import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import { literal, string, type } from 'io-ts';
export interface ApplicationOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'application';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const ApplicationOAuth2SecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('oauth2'),
		flow: literal('application'),
		tokenUrl: string,
		scopes: ScopesObject,
	},
	'ApplicationOAuth2SecuritySchemeObject',
);
