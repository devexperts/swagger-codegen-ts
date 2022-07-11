import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject } from './reference-object';
import { SchemaObject } from './schema-object';
import { MessageObject } from './message-object';
import { ParametersObject } from './parameters-object';
import { CorrelationIdObject } from './correlation-id-object';
import { OperationTraitObject } from './operation-trait-object';
import { MessageTraitObject } from './message-trait-object';
import { Branded } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { SecuritySchemeObject } from './security-scheme-object';
export interface ComponentsObjectFieldPatternBrand {
    readonly ComponentsObjectFieldPattern: unique symbol;
}
export declare type ComponentsObjectFieldPattern = Branded<string, ComponentsObjectFieldPatternBrand>;
export interface ComponentsObject {
    readonly schemas: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | SchemaObject>>;
    readonly messages: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | MessageObject>>;
    readonly securitySchemes: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | SecuritySchemeObject>>;
    readonly parameters: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | ParametersObject>>;
    readonly correlationIds: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | CorrelationIdObject>>;
    readonly operationTraits: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | OperationTraitObject>>;
    readonly messageTraits: Option<Record<ComponentsObjectFieldPattern, ReferenceObject | MessageTraitObject>>;
}
export declare const ComponentsObjectCodec: Codec<ComponentsObject>;
