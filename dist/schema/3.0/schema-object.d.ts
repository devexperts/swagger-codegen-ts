import { ReferenceObject } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec, JSONPrimitive } from '../../utils/io-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export interface BaseSchemaObject {
    readonly format: Option<string>;
    readonly deprecated: Option<boolean>;
    readonly nullable: Option<boolean>;
    readonly maxItems: Option<number>;
    readonly minItems: Option<number>;
}
export interface EnumSchemaObject extends BaseSchemaObject {
    readonly enum: NonEmptyArray<JSONPrimitive>;
}
export declare const EnumSchemaObjectCodec: Codec<EnumSchemaObject>;
/**
 * Primitive type SchemaObject
 * `null` is not supported as a primitive type
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#data-types
 */
export interface PrimitiveSchemaObject extends BaseSchemaObject {
    readonly format: Option<string>;
    readonly type: 'boolean' | 'string' | 'number' | 'integer';
}
export declare const PrimitiveSchemaObjectCodec: Codec<PrimitiveSchemaObject>;
export interface ObjectSchemaObject extends BaseSchemaObject {
    readonly type: 'object';
    readonly properties: Option<Record<string, ReferenceObject | SchemaObject>>;
    readonly additionalProperties: Option<boolean | ReferenceObject | SchemaObject>;
    readonly required: Option<string[]>;
}
export declare const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject>;
export interface ArraySchemaObject extends BaseSchemaObject {
    readonly type: 'array';
    readonly items: ReferenceObject | SchemaObject;
}
export declare const ArraySchemaObjectCodec: Codec<ArraySchemaObject>;
export interface AllOfSchemaObject extends BaseSchemaObject {
    readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}
export declare const AllOfSchemaObjectCodec: Codec<AllOfSchemaObject>;
export interface OneOfSchemaObject extends BaseSchemaObject {
    readonly oneOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}
export declare const OneOfSchemaObjectCodec: Codec<OneOfSchemaObject>;
export declare type SchemaObject = EnumSchemaObject | PrimitiveSchemaObject | ObjectSchemaObject | ArraySchemaObject | AllOfSchemaObject | OneOfSchemaObject;
export declare const SchemaObjectCodec: Codec<SchemaObject>;
