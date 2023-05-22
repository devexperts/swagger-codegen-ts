import { Option } from 'fp-ts/lib/Option';
export interface ContactObject {
    readonly name: Option<string>;
    readonly url: Option<string>;
    readonly email: Option<string>;
}
export declare const ContactObject: import("io-ts").TypeC<{
    name: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    url: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    email: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
