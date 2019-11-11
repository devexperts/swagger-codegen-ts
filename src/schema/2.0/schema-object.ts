import {
	Codec,
	dictionary,
	JSONPrimitive,
	JSONPrimitiveCodec,
	stringArrayOption,
	stringOption,
} from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { intersection, literal, recursion, string, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../utils/types';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface BaseSchemaObject {
	readonly description: Option<string>;
	readonly format: Option<string>;
}
export const BaseSchemaObjectCodec: Codec<BaseSchemaObject> = type({
	description: optionFromNullable(string),
	format: optionFromNullable(string),
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

export interface NullSchemaObject extends BaseSchemaObject {
	readonly type: 'null';
}

export const NullSchemaObjectCodec: Codec<NullSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('null'),
		}),
	],
	'NullSchemaObject',
);

export interface StringSchemaObject extends BaseSchemaObject {
	readonly type: 'string';
}

export const StringSchemaObjectCodec: Codec<StringSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('string'),
		}),
	],
	'StringSchemaObject',
);

export interface NumberSchemaObject extends BaseSchemaObject {
	readonly type: 'number';
}

export const NumberSchemaObjectCodec: Codec<NumberSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('number'),
			format: stringOption,
		}),
	],
	'NumberSchemaObject',
);

export interface IntegerSchemaObject extends BaseSchemaObject {
	readonly type: 'integer';
}

export const IntegerSchemaObjectCodec: Codec<IntegerSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('integer'),
			format: stringOption,
		}),
	],
	'IntegerSchemaObject',
);

export interface BooleanSchemaObject extends BaseSchemaObject {
	readonly type: 'boolean';
}

export const BooleanSchemaObjectCodec: Codec<BooleanSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('boolean'),
		}),
	],
	'BooleanSchemaObject',
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

const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
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
	| NullSchemaObject
	| AllOfSchemaObject
	| ObjectSchemaObject
	| StringSchemaObject
	| NumberSchemaObject
	| IntegerSchemaObject
	| BooleanSchemaObject
	| ArraySchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([
		ReferenceObjectCodec,
		EnumSchemaObjectCodec,
		NullSchemaObjectCodec,
		AllOfSchemaObject,
		ArraySchemaObjectCodec,
		ObjectSchemaObjectCodec,
		StringSchemaObjectCodec,
		NumberSchemaObjectCodec,
		IntegerSchemaObjectCodec,
		BooleanSchemaObjectCodec,
	]),
);
