import { Codec, Natural, NonEmptySet, Positive, JSONPrimitive } from '../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject } from './reference-object';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ExternalDocumentationObject } from './external-documentation-object';
export interface BaseSchemaObject {
    externalDocs: Option<ExternalDocumentationObject>;
    deprecated: Option<boolean>;
}
export declare const BaseSchemaObjectCodec: Codec<BaseSchemaObject>;
export interface EnumSchemaObject extends BaseSchemaObject {
    readonly enum: NonEmptyArray<JSONPrimitive>;
}
export declare const EnumSchemaObjectCodec: Codec<EnumSchemaObject>;
export interface ConstSchemaObject extends BaseSchemaObject {
    readonly const: JSONPrimitive;
}
export declare const ConstSchemaObjectCodec: Codec<ConstSchemaObject>;
export interface AllOfSchemaObject extends BaseSchemaObject {
    readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}
export declare const AllOfSchemaObjectCodec: Codec<AllOfSchemaObject>;
export interface OneOfSchemaObject extends BaseSchemaObject {
    readonly oneOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}
export declare const OneOfSchemaObjectCodec: Codec<OneOfSchemaObject>;
export interface BasePrimitiveSchemaObject extends BaseSchemaObject {
    readonly format: Option<string>;
}
export declare const BasePrimitiveSchemaObjectCodec: Codec<BasePrimitiveSchemaObject>;
export interface NullSchemaObject extends BasePrimitiveSchemaObject {
    readonly type: 'null';
}
export interface BooleanSchemaObject extends BasePrimitiveSchemaObject {
    readonly type: 'boolean';
}
export interface BaseNumericSchemaObject extends BasePrimitiveSchemaObject {
    readonly multipleOf: Option<Positive>;
    readonly maximum: Option<number>;
    readonly exclusiveMaximum: Option<number>;
    readonly minimum: Option<number>;
    readonly exclusiveMinimum: Option<number>;
}
export interface NumberSchemaObject extends BaseNumericSchemaObject {
    readonly type: 'number';
}
export interface IntegerSchemaObject extends BaseNumericSchemaObject {
    readonly type: 'integer';
}
export interface StringSchemaObject extends BasePrimitiveSchemaObject {
    readonly type: 'string';
    readonly maxLength: Option<Natural>;
    readonly minLength: Option<Natural>;
    readonly pattern: Option<string>;
}
export interface ArraySchemaObject extends BaseSchemaObject {
    readonly type: 'array';
    readonly items: ReferenceObject | SchemaObject;
    readonly maxItems: Option<Natural>;
    readonly minItems: Option<Natural>;
}
export interface ObjectSchemaObject extends BaseSchemaObject {
    readonly type: 'object';
    readonly properties: Option<Record<string, ReferenceObject | SchemaObject>>;
    readonly additionalProperties: Option<ReferenceObject | SchemaObject>;
    readonly required: Option<NonEmptySet<string>>;
}
export declare const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject>;
export declare type SchemaObject = EnumSchemaObject | ConstSchemaObject | AllOfSchemaObject | OneOfSchemaObject | NullSchemaObject | BooleanSchemaObject | NumberSchemaObject | IntegerSchemaObject | StringSchemaObject | ArraySchemaObject | ObjectSchemaObject;
export declare const SchemaObjectCodec: Codec<SchemaObject>;
