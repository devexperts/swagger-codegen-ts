import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
export interface TagObject {
    readonly name: string;
    readonly description: Option<string>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
}
export declare const TagObject: import("io-ts").TypeC<{
    name: import("io-ts").StringC;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    externalDocs: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        url: import("io-ts").StringC;
    }>>;
}>;
