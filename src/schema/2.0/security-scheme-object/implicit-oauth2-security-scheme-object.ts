import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import { literal, string, type } from 'io-ts';

export interface ImplicitOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'implicit';
	readonly authorizationUrl: string;
	readonly scopes: ScopesObject;
}

export const ImplicitOAuth2SecuritySchemeObject = type(
	{
		...BaseSecuritySchemeObjectProps,
		type: literal('oauth2'),
		flow: literal('implicit'),
		authorizationUrl: string,
		scopes: ScopesObject,
	},
	'ImplicitOAuth2SecuritySchemeObject',
);
