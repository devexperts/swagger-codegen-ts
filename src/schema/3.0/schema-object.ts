import { array, boolean, intersection, literal, record, recursion, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Codec, JSONPrimitive, JSONPrimitiveCodec, numberOption } from '../../utils/io-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface BaseSchemaObject {
	readonly format: Option<string>;
	readonly deprecated: Option<boolean>;
	readonly nullable: Option<boolean>;
	readonly maxItems: Option<number>;
	readonly minItems: Option<number>;
}

const BaseSchemaObjectCodec: Codec<BaseSchemaObject> = type({
	format: optionFromNullable(string),
	deprecated: optionFromNullable(boolean),
	nullable: optionFromNullable(boolean),
	maxItems: numberOption,
	minItems: numberOption,
});

export interface EnumSchemaObject extends BaseSchemaObject {
	readonly enum: NonEmptyArray<JSONPrimitive>;
}

export const EnumSchemaObjectCodec: Codec<EnumSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			enum: nonEmptyArray(JSONPrimitiveCodec),
		}),
	],
	'EnumSchemaObject',
);

/**
 * Primitive type SchemaObject
 * `null` is not supported as a primitive type
 * @see https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#data-types
 */
export interface PrimitiveSchemaObject extends BaseSchemaObject {
	readonly format: Option<string>;
	readonly type: 'boolean' | 'string' | 'number' | 'integer';
}

export const PrimitiveSchemaObjectCodec: Codec<PrimitiveSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			format: optionFromNullable(string),
			type: union([literal('boolean'), literal('string'), literal('number'), literal('integer')]),
		}),
	],
	'PrimitiveSchemaObject',
);

export interface ObjectSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Record<string, ReferenceObject | SchemaObject>>;
	readonly additionalProperties: Option<boolean | ReferenceObject | SchemaObject>;
	readonly required: Option<string[]>;
}

export const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			type: literal('object'),
			properties: optionFromNullable(record(string, union([ReferenceObjectCodec, SchemaObjectCodec]))),
			additionalProperties: optionFromNullable(union([boolean, ReferenceObjectCodec, SchemaObjectCodec])),
			required: optionFromNullable(array(string)),
		}),
	]),
);

export interface ArraySchemaObject extends BaseSchemaObject {
	readonly type: 'array';
	readonly items: ReferenceObject | SchemaObject;
}

export const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			type: literal('array'),
			items: union([ReferenceObjectCodec, SchemaObjectCodec]),
		}),
	]),
);

export interface AllOfSchemaObject extends BaseSchemaObject {
	readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const AllOfSchemaObjectCodec: Codec<AllOfSchemaObject> = recursion('AllOfSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			allOf: nonEmptyArray(union([ReferenceObjectCodec, SchemaObjectCodec])),
		}),
	]),
);

export interface AnyOfSchemaObject extends BaseSchemaObject {
	readonly anyOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const AnyOfSchemaObjectCodec: Codec<AnyOfSchemaObject> = recursion('AnyOfSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			anyOf: nonEmptyArray(union([ReferenceObjectCodec, SchemaObjectCodec])),
		}),
	]),
);

export interface OneOfSchemaObject extends BaseSchemaObject {
	readonly oneOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const OneOfSchemaObjectCodec: Codec<OneOfSchemaObject> = recursion('OneOfSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			oneOf: nonEmptyArray(union([ReferenceObjectCodec, SchemaObjectCodec])),
		}),
	]),
);

export type SchemaObject =
	| EnumSchemaObject
	| PrimitiveSchemaObject
	| ObjectSchemaObject
	| ArraySchemaObject
	| AllOfSchemaObject
	| AnyOfSchemaObject
	| OneOfSchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([
		EnumSchemaObjectCodec,
		PrimitiveSchemaObjectCodec,
		ObjectSchemaObjectCodec,
		ArraySchemaObjectCodec,
		AllOfSchemaObjectCodec,
		AnyOfSchemaObjectCodec,
		OneOfSchemaObjectCodec,
	]),
);
