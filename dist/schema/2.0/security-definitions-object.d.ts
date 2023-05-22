import { Dictionary } from '../../utils/types';
import { SecuritySchemeObject } from './security-scheme-object/security-scheme-object';
export interface SecurityDefinitionsObject extends Dictionary<SecuritySchemeObject> {
}
export declare const SecurityDefinitionsObject: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").UnionC<[import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"basic">;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>, import("io-ts").TypeC<{
    type: import("io-ts").LiteralC<"apiKey">;
    in: import("io-ts").UnionC<[import("io-ts").LiteralC<"query">, import("io-ts").LiteralC<"header">]>;
    name: import("io-ts").StringC;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>, import("io-ts").UnionC<[import("io-ts").TypeC<{
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
}>]>]>>;
