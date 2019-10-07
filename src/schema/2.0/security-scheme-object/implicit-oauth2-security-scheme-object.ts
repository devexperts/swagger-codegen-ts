import * as t from 'io-ts';
import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';

export interface ImplicitOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'implicit';
	readonly authorizationUrl: string;
	readonly scopes: ScopesObject;
}

export const ImplicitOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('implicit'),
		authorizationUrl: t.string,
		scopes: ScopesObject,
	},
	'ImplicitOAuth2SecuritySchemeObject',
);
