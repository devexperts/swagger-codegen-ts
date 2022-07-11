import { Option } from 'fp-ts/lib/Option';
export interface LicenseObject {
    readonly name: string;
    readonly url: Option<string>;
}
export declare const LicenseObject: import("io-ts").TypeC<{
    name: import("io-ts").StringC;
    url: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>;
