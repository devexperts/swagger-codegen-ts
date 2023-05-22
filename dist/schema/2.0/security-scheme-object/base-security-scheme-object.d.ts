import { Option } from 'fp-ts/lib/Option';
export interface BaseSecuritySchemeObjectProps {
    readonly description: Option<string>;
}
export declare const BaseSecuritySchemeObjectProps: {
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
};
