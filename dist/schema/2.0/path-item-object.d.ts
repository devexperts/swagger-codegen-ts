import { OperationObject } from './operation-object';
import { ParameterObject } from './parameter-object';
import { ReferenceObject } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
export interface PathItemObject {
    readonly $ref: Option<string>;
    readonly get: Option<OperationObject>;
    readonly put: Option<OperationObject>;
    readonly post: Option<OperationObject>;
    readonly delete: Option<OperationObject>;
    readonly options: Option<OperationObject>;
    readonly head: Option<OperationObject>;
    readonly patch: Option<OperationObject>;
    readonly parameters: Option<Array<ReferenceObject | ParameterObject>>;
}
export declare const PathItemObjectCodec: import("io-ts").TypeC<{
    $ref: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    get: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    put: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    post: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    delete: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    options: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    head: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    patch: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
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
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<ReferenceObject>, import("../../utils/io-ts").Codec<ParameterObject>]>>>;
}>;
