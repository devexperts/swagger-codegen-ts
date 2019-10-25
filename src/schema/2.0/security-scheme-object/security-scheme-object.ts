import { BasicSecuritySchemeObject } from './basic-security-scheme-object';
import { ApiKeySecuritySchemeObject } from './api-key-security-scheme-object';
import { OAuth2SecuritySchemeObject } from './oauth2-security-scheme-object';
import { union } from 'io-ts';

export type SecuritySchemeObject = BasicSecuritySchemeObject | ApiKeySecuritySchemeObject | OAuth2SecuritySchemeObject;
export const SecuritySchemeObject = union(
	[BasicSecuritySchemeObject, ApiKeySecuritySchemeObject, OAuth2SecuritySchemeObject],
	'SecuritySchemeObject',
);
