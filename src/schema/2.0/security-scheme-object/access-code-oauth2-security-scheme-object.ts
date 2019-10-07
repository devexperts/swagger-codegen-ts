import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
import * as t from 'io-ts';

export interface AccessCodeOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
	readonly type: 'oauth2';
	readonly flow: 'accessCode';
	readonly tokenUrl: string;
	readonly scopes: ScopesObject;
}

export const AccessCodeOAuth2SecuritySchemeObject = t.type(
	{
		...BaseSecuritySchemeObjectProps,
		type: t.literal('oauth2'),
		flow: t.literal('accessCode'),
		tokenUrl: t.string,
		scopes: ScopesObject,
	},
	'AccessCodeOAuth2SecuritySchemeObject',
);
