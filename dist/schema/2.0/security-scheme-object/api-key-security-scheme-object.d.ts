import { BaseSecuritySchemeObjectProps } from './base-security-scheme-object';
export interface ApiKeySecuritySchemeObject extends BaseSecuritySchemeObjectProps {
    readonly type: 'apiKey';
    readonly in: 'query' | 'header';
    readonly name: string;
}
export declare const ApiKeySecuritySchemeObject: import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"apiKey">;
    in: import("io-ts").UnionC<[import("io-ts").LiteralC<"query">, import("io-ts").LiteralC<"header">]>;
    name: import("io-ts").StringC;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
