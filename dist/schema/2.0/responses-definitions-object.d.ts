import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
export interface ResponsesDefinitionsObject extends Dictionary<ResponseObject> {
}
export declare const ResponsesDefinitionsObject: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").TypeC<{
    description: import("io-ts").StringC;
    schema: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("../../utils/io-ts").Codec<import("./schema-object").SchemaObject>>;
    headers: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").IntersectionC<[import("../../utils/io-ts").Codec<import("./items-object").ItemsObject>, import("io-ts").TypeC<{
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>]>>>;
    examples: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>>;
}>>;
