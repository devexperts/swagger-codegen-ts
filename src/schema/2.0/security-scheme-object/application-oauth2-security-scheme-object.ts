import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import * as t from 'io-ts';

export interface ApplicationOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'application';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const ApplicationOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('application'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'ApplicationOAuth2SecuritySchemeObject',
);
