import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface BaseSecuritySchemeObject {
    readonly description: Option<string>;
}
export interface UserPasswordSecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'userPassword';
}
export declare const UserPasswordSecuritySchemeObjectCodec: Codec<UserPasswordSecuritySchemeObject>;
export interface APIKeySecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'apiKey';
}
export declare const APIKeySecuritySchemeObjectCodec: Codec<APIKeySecuritySchemeObject>;
export interface X509SecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'X509';
}
export declare const X509SecuritySchemeObjectCodec: Codec<X509SecuritySchemeObject>;
export interface SymmetricEncryptionSecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'symmetricEncryption';
}
export declare const SymmetricEncryptionSecuritySchemeObjectCodec: Codec<SymmetricEncryptionSecuritySchemeObject>;
export interface AssymmetricEncryptionSecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'asymmetricEncryption';
}
export declare const AssymmetricEncryptionSecuritySchemeObjectCodec: Codec<AssymmetricEncryptionSecuritySchemeObject>;
export interface HTTPAPIKeySecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'httpApiKey';
}
export declare const HTTPAPIKeySecuritySchemeObjectCodec: Codec<HTTPAPIKeySecuritySchemeObject>;
export interface HTTPSecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'http';
}
export declare const HTTPSecuritySchemeObjectCodec: Codec<HTTPSecuritySchemeObject>;
export interface OAuth2SecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'oauth2';
}
export declare const OAuth2SecuritySchemeObjectCodec: Codec<OAuth2SecuritySchemeObject>;
export interface OpenIdConnectSecuritySchemeObject extends BaseSecuritySchemeObject {
    readonly type: 'openIdConnect';
}
export declare const OpenIdConnectSecuritySchemeObjectCodec: Codec<OpenIdConnectSecuritySchemeObject>;
export declare type SecuritySchemeObject = UserPasswordSecuritySchemeObject | APIKeySecuritySchemeObject | X509SecuritySchemeObject | SymmetricEncryptionSecuritySchemeObject | AssymmetricEncryptionSecuritySchemeObject | HTTPAPIKeySecuritySchemeObject | OAuth2SecuritySchemeObject | OpenIdConnectSecuritySchemeObject;
export declare const SecuritySchemeObjectCodec: Codec<SecuritySchemeObject>;
