import { Codec, dictionary, JSONPrimitive, JSONPrimitiveCodec, stringArrayOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { intersection, literal, recursion, string, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../utils/types';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface BaseSchemaObject {
	readonly description: Option<string>;
}
export const BaseSchemaObjectCodec: Codec<BaseSchemaObject> = type({
	description: optionFromNullable(string),
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

export interface PrimitiveSchemaObject extends BaseSchemaObject {
	readonly format: Option<string>;
	readonly type: 'null' | 'string' | 'number' | 'integer' | 'boolean';
}

export const PrimitiveSchemaObjectCodec: Codec<PrimitiveSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			format: optionFromNullable(string),
			type: union([
				literal('null'),
				literal('string'),
				literal('number'),
				literal('integer'),
				literal('boolean'),
			]),
		}),
	],
	'PrimitiveSchemaObject',
);

export interface AllOfSchemaObject extends BaseSchemaObject {
	readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const AllOfSchemaObject: Codec<AllOfSchemaObject> = recursion('ReferenceOrAllOfSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			allOf: nonEmptyArray(union([ReferenceObjectCodec, SchemaObjectCodec])),
		}),
	]),
);

export interface ArraySchemaObject extends BaseSchemaObject {
	readonly type: 'array';
	readonly items: SchemaObject;
}

export const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			type: literal('array'),
			items: SchemaObjectCodec,
		}),
	]),
);

export interface ObjectSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Dictionary<SchemaObject>>;
	readonly required: Option<string[]>;
	readonly additionalProperties: Option<SchemaObject>;
}

const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			required: stringArrayOption,
			type: literal('object'),
			properties: optionFromNullable(dictionary(SchemaObjectCodec, 'Dictionary<SchemaObject>')),
			additionalProperties: optionFromNullable(SchemaObjectCodec),
		}),
	]),
);

export type SchemaObject =
	| ReferenceObject
	| EnumSchemaObject
	| PrimitiveSchemaObject
	| AllOfSchemaObject
	| ObjectSchemaObject
	| ArraySchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([
		ReferenceObjectCodec,
		EnumSchemaObjectCodec,
		PrimitiveSchemaObjectCodec,
		AllOfSchemaObject,
		ObjectSchemaObjectCodec,
		ArraySchemaObjectCodec,
	]),
);
