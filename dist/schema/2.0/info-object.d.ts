import { ContactObject } from './contact-object';
import { LicenseObject } from './license-object';
import { Option } from 'fp-ts/lib/Option';
export interface InfoObject {
    readonly title: string;
    readonly description: Option<string>;
    readonly termsOfService: Option<string>;
    readonly contact: Option<ContactObject>;
    readonly license: Option<LicenseObject>;
    readonly version: string;
}
export declare const InfoObject: import("io-ts").TypeC<{
    title: import("io-ts").StringC;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    termsOfService: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    contact: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
        name: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        url: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        email: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>>;
    license: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
        name: import("io-ts").StringC;
        url: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>>;
    version: import("io-ts").StringC;
}>;
