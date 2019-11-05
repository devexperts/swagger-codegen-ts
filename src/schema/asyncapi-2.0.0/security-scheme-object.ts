import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { intersection, literal, string, type, union } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface BaseSecuritySchemeObject {
	readonly description: Option<string>;
}

const BaseSecuritySchemeObjectCodec: Codec<BaseSecuritySchemeObject> = type({
	description: optionFromNullable(string),
});

export interface UserPasswordSecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'userPassword';
}
export const UserPasswordSecuritySchemeObjectCodec: Codec<UserPasswordSecuritySchemeObject> = intersection(
	[
		BaseSecuritySchemeObjectCodec,
		type({
			type: literal('userPassword'),
		}),
	],
	'UserPasswordSecuritySchemeObject',
);

export interface APIKeySecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'apiKey';
}
export const APIKeySecuritySchemeObjectCodec: Codec<APIKeySecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('apiKey'),
	}),
]);

export interface X509SecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'X509';
}
export const X509SecuritySchemeObjectCodec: Codec<X509SecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('X509'),
	}),
]);

export interface SymmetricEncryptionSecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'symmetricEncryption';
}
export const SymmetricEncryptionSecuritySchemeObjectCodec: Codec<
	SymmetricEncryptionSecuritySchemeObject
> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('symmetricEncryption'),
	}),
]);

export interface AssymmetricEncryptionSecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'asymmetricEncryption';
}
export const AssymmetricEncryptionSecuritySchemeObjectCodec: Codec<
	AssymmetricEncryptionSecuritySchemeObject
> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('asymmetricEncryption'),
	}),
]);

export interface HTTPAPIKeySecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'httpApiKey';
}
export const HTTPAPIKeySecuritySchemeObjectCodec: Codec<HTTPAPIKeySecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('httpApiKey'),
	}),
]);

export interface HTTPSecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'http';
}
export const HTTPSecuritySchemeObjectCodec: Codec<HTTPSecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('http'),
	}),
]);

export interface OAuth2SecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'oauth2';
}
export const OAuth2SecuritySchemeObjectCodec: Codec<OAuth2SecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('oauth2'),
	}),
]);

export interface OpenIdConnectSecuritySchemeObject extends BaseSecuritySchemeObject {
	readonly type: 'openIdConnect';
}
export const OpenIdConnectSecuritySchemeObjectCodec: Codec<OpenIdConnectSecuritySchemeObject> = intersection([
	BaseSecuritySchemeObjectCodec,
	type({
		type: literal('openIdConnect'),
	}),
]);

export type SecuritySchemeObject =
	| UserPasswordSecuritySchemeObject
	| APIKeySecuritySchemeObject
	| X509SecuritySchemeObject
	| SymmetricEncryptionSecuritySchemeObject
	| AssymmetricEncryptionSecuritySchemeObject
	| HTTPAPIKeySecuritySchemeObject
	| OAuth2SecuritySchemeObject
	| OpenIdConnectSecuritySchemeObject;

export const SecuritySchemeObjectCodec: Codec<SecuritySchemeObject> = union(
	[
		UserPasswordSecuritySchemeObjectCodec,
		APIKeySecuritySchemeObjectCodec,
		X509SecuritySchemeObjectCodec,
		SymmetricEncryptionSecuritySchemeObjectCodec,
		AssymmetricEncryptionSecuritySchemeObjectCodec,
		HTTPAPIKeySecuritySchemeObjectCodec,
		OAuth2SecuritySchemeObjectCodec,
		OpenIdConnectSecuritySchemeObjectCodec,
	],
	'SecuritySchemeObjectCodec',
);
