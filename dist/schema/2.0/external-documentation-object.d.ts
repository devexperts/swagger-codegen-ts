import { Option } from 'fp-ts/lib/Option';
export interface ExternalDocumentationObject {
    readonly description: Option<string>;
    readonly url: string;
}
export declare const ExternalDocumentationObject: import("io-ts").TypeC<{
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    url: import("io-ts").StringC;
}>;
