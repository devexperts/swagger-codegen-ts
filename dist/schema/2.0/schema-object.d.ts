import { Codec, JSONPrimitive } from '../../utils/io-ts';
import { ReferenceObject } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../utils/types';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
export interface BaseSchemaObject {
    readonly description: Option<string>;
}
export declare const BaseSchemaObjectCodec: Codec<BaseSchemaObject>;
export interface EnumSchemaObject extends BaseSchemaObject {
    readonly enum: NonEmptyArray<JSONPrimitive>;
}
export declare const EnumSchemaObjectCodec: Codec<EnumSchemaObject>;
export interface PrimitiveSchemaObject extends BaseSchemaObject {
    readonly format: Option<string>;
    readonly type: 'null' | 'string' | 'number' | 'integer' | 'boolean';
}
export declare const PrimitiveSchemaObjectCodec: Codec<PrimitiveSchemaObject>;
export interface AllOfSchemaObject extends BaseSchemaObject {
    readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}
export declare const AllOfSchemaObject: Codec<AllOfSchemaObject>;
export interface ArraySchemaObject extends BaseSchemaObject {
    readonly type: 'array';
    readonly items: SchemaObject;
}
export declare const ArraySchemaObjectCodec: Codec<ArraySchemaObject>;
export interface ObjectSchemaObject extends BaseSchemaObject {
    readonly type: 'object';
    readonly properties: Option<Dictionary<SchemaObject>>;
    readonly required: Option<string[]>;
    readonly additionalProperties: Option<SchemaObject>;
}
export declare type SchemaObject = ReferenceObject | EnumSchemaObject | PrimitiveSchemaObject | AllOfSchemaObject | ObjectSchemaObject | ArraySchemaObject;
export declare const SchemaObjectCodec: Codec<SchemaObject>;
