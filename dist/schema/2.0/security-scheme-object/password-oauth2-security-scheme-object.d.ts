import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
export interface PasswordOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
    readonly type: 'oauth2';
    readonly flow: 'password';
    readonly tokenUrl: string;
    readonly scopes: ScopesObject;
}
export declare const PasswordOAuth2SecuritySchemeObject: import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"password">;
    tokenUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
