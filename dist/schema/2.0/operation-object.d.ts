import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
import { ParameterObject } from './parameter-object';
import { ReferenceObject } from './reference-object';
import { ResponsesObject } from './responses-object';
import { SecurityRequirementObject } from './security-requirement-object';
export interface OperationObject {
    readonly tags: Option<string[]>;
    readonly summary: Option<string>;
    readonly description: Option<string>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
    readonly operationId: Option<string>;
    readonly consumes: Option<string[]>;
    readonly produces: Option<string[]>;
    readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
    readonly responses: ResponsesObject;
    readonly schemes: Option<string[]>;
    readonly deprecated: Option<boolean>;
    readonly security: Option<SecurityRequirementObject[]>;
}
export declare const OperationObject: import("io-ts").TypeC<{
    tags: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    summary: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    externalDocs: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        url: import("io-ts").StringC;
    }>>;
    operationId: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    consumes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    produces: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<ReferenceObject>, import("../../utils/io-ts").Codec<ParameterObject>]>>>;
    responses: import("../../utils/io-ts").Codec<ResponsesObject>;
    schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
    security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
}>;
