import { Option } from 'fp-ts/lib/Option';
import { InfoObject } from './info-object';
import { ExternalDocumentationObject } from './external-documentation-object';
import { SecurityRequirementObject } from './security-requirement-object';
import { TagObject } from './tag-object';
import { ResponsesDefinitionsObject } from './responses-definitions-object';
import { SecurityDefinitionsObject } from './security-definitions-object';
import { DefinitionsObject } from './definitions-object';
import { PathsObject } from './paths-object';
import { ParametersDefinitionsObject } from './parameters-definitions-object';
export interface SwaggerObject {
    readonly basePath: Option<string>;
    readonly consumes: Option<string[]>;
    readonly definitions: Option<DefinitionsObject>;
    readonly externalDocs: Option<ExternalDocumentationObject>;
    readonly host: Option<string>;
    readonly info: InfoObject;
    readonly parameters: Option<ParametersDefinitionsObject>;
    readonly paths: PathsObject;
    readonly produces: Option<string[]>;
    readonly responses: Option<ResponsesDefinitionsObject>;
    readonly schemes: Option<string[]>;
    readonly security: Option<SecurityRequirementObject[]>;
    readonly securityDefinitions: Option<SecurityDefinitionsObject>;
    readonly swagger: string;
    readonly tags: Option<TagObject[]>;
}
export declare const SwaggerObject: import("io-ts").TypeC<{
    basePath: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    consumes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    definitions: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("../../utils/io-ts").Codec<import("./schema-object").SchemaObject>>>;
    externalDocs: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        url: import("io-ts").StringC;
    }>>;
    host: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    info: import("io-ts").TypeC<{
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
    parameters: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("../../utils/io-ts").Codec<import("./parameter-object").ParameterObject>>>;
    paths: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").TypeC<{
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
    produces: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    responses: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").TypeC<{
        description: import("io-ts").StringC;
        schema: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("../../utils/io-ts").Codec<import("./schema-object").SchemaObject>>;
        headers: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").IntersectionC<[import("../../utils/io-ts").Codec<import("./items-object").ItemsObject>, import("io-ts").TypeC<{
            description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        }>]>>>;
        examples: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>>;
    }>>>;
    schemes: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").StringC>>;
    security: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").ArrayC<import("io-ts").StringC>>>>;
    securityDefinitions: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").UnionC<[import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"basic">;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>, import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"apiKey">;
        in: import("io-ts").UnionC<[import("io-ts").LiteralC<"query">, import("io-ts").LiteralC<"header">]>;
        name: import("io-ts").StringC;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>, import("io-ts").UnionC<[import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"oauth2">;
        flow: import("io-ts").LiteralC<"implicit">;
        authorizationUrl: import("io-ts").StringC;
        scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>, import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"oauth2">;
        flow: import("io-ts").LiteralC<"password">;
        tokenUrl: import("io-ts").StringC;
        scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>, import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"oauth2">;
        flow: import("io-ts").LiteralC<"application">;
        tokenUrl: import("io-ts").StringC;
        scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>, import("io-ts").TypeC<{
        type: import("io-ts").LiteralC<"oauth2">;
        flow: import("io-ts").LiteralC<"accessCode">;
        tokenUrl: import("io-ts").StringC;
        scopes: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").StringC>;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
    }>]>]>>>;
    swagger: import("io-ts").StringC;
    tags: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").ArrayC<import("io-ts").TypeC<{
        name: import("io-ts").StringC;
        description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
        externalDocs: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").TypeC<{
            description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
            url: import("io-ts").StringC;
        }>>;
    }>>>;
}>;
