import { Codec, dictionary, primitiveArrayOption, stringArrayOption, stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject } from './reference-object';
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

export interface StringPropertySchemaObject extends BaseSchemaObject {
	readonly type: 'string';
	readonly enum: Option<Array<string | number | boolean>>;
}

export const StringPropertySchemaObjectCodec: Codec<StringPropertySchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('string'),
			enum: primitiveArrayOption,
		}),
	],
	'StringPropertySchemaObject',
);

export interface NumberPropertySchemaObject extends BaseSchemaObject {
	readonly type: 'number';
}

export const NumberPropertySchemaObjectCodec: Codec<NumberPropertySchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('number'),
			format: stringOption,
		}),
	],
	'NumberPropertySchemaObject',
);

export interface IntegerPropertySchemaObject extends BaseSchemaObject {
	readonly type: 'integer';
}

export const IntegerPropertySchemaObjectCodec: Codec<IntegerPropertySchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('integer'),
			format: stringOption,
		}),
	],
	'IntegerPropertySchemaObject',
);

export interface BooleanPropertySchemaObject extends BaseSchemaObject {
	readonly type: 'boolean';
}

export const BooleanPropertySchemaObjectCodec: Codec<BooleanPropertySchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			type: literal('boolean'),
		}),
	],
	'BooleanPropertySchemaObject',
);

export interface AllOfSchemaObject extends BaseSchemaObject {
	readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const AllOfSchemaObject: Codec<AllOfSchemaObject> = recursion('ReferenceOrAllOfSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			allOf: nonEmptyArray(union([ReferenceObject, SchemaObjectCodec])),
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
	| AllOfSchemaObject
	| ObjectSchemaObject
	| StringPropertySchemaObject
	| NumberPropertySchemaObject
	| IntegerPropertySchemaObject
	| BooleanPropertySchemaObject
	| ArraySchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([
		ReferenceObject,
		AllOfSchemaObject,
		ArraySchemaObjectCodec,
		ObjectSchemaObjectCodec,
		StringPropertySchemaObjectCodec,
		NumberPropertySchemaObjectCodec,
		IntegerPropertySchemaObjectCodec,
		BooleanPropertySchemaObjectCodec,
	]),
);
