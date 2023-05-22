import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
export interface BasicSecuritySchemeObject extends BaseSecuritySchemeObjectProps {
    readonly type: 'basic';
}
export declare const BasicSecuritySchemeObject: import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"basic">;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
