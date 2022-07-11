import { ImplicitOAuth2SecuritySchemeObject } from './implicit-oauth2-security-scheme-object';
import { PasswordOAuth2SecuritySchemeObject } from './password-oauth2-security-scheme-object';
import { ApplicationOAuth2SecuritySchemeObject } from './application-oauth2-security-scheme-object';
import { AccessCodeOAuth2SecuritySchemeObject } from './access-code-oauth2-security-scheme-object';
export declare type OAuth2SecuritySchemeObject = ImplicitOAuth2SecuritySchemeObject | PasswordOAuth2SecuritySchemeObject | ApplicationOAuth2SecuritySchemeObject | AccessCodeOAuth2SecuritySchemeObject;
export declare const OAuth2SecuritySchemeObject: import("io-ts").UnionC<[import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"implicit">;
    authorizationUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>, import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"password">;
    tokenUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>, import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"application">;
    tokenUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>, import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"accessCode">;
    tokenUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>]>;
