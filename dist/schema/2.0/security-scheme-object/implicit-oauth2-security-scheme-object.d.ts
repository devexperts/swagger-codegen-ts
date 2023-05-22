import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
import { ScopesObject } from '../scopes-object';
export interface ImplicitOAuth2SecuritySchemeObject extends BaseSecuritySchemeObjectProps {
    readonly type: 'oauth2';
    readonly flow: 'implicit';
    readonly authorizationUrl: string;
    readonly scopes: ScopesObject;
}
export declare const ImplicitOAuth2SecuritySchemeObject: import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"oauth2">;
    flow: import("io-ts").LiteralC<"implicit">;
    authorizationUrl: import("io-ts").StringC;
    scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
