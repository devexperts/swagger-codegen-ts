import { Option } from 'fp-ts/lib/Option';
import { ExampleObject } from './example-object';
import { HeadersObject } from './headers-object';
import { SchemaObject } from './schema-object';
export interface ResponseObject {
    readonly description: string;
    readonly schema: Option<SchemaObject>;
    readonly headers: Option<HeadersObject>;
    readonly examples: Option<ExampleObject>;
}
export declare const ResponseObject: import("io-ts").TypeC<{
    description: import("io-ts").StringC;
    schema: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("../../utils/io-ts").Codec<SchemaObject>>;
    headers: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").IntersectionC<[import("../../utils/io-ts").Codec<import("./items-object").ItemsObject>, import("io-ts").TypeC<{
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>]>>>;
    examples: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>>;
}>;
