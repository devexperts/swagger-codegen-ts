import { Dictionary } from '../../utils/types';
import { PathItemObject } from './path-item-object';
export interface PathsObject extends Dictionary<PathItemObject> {
}
export declare const PathsObject: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").TypeC<{
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
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
        parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
        responses: import("../../utils/io-ts").Codec<import("./responses-object").ResponsesObject>;
        schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
        deprecated: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").BooleanC>;
        security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    }>>;
    parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").UnionC<[import("../../utils/io-ts").Codec<import("./reference-object").ReferenceObject>, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>]>>>;
}>>;
