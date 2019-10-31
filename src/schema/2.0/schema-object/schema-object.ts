import { Codec, dictionary, stringArrayOption, stringOption } from '../../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject } from '../reference-object';
import { StringPropertySchemaObject } from './string-property-schema-object';
import { NumberPropertySchemaObject } from './number-property-schema-object';
import { IntegerPropertySchemaObject } from './integer-property-schema-object';
import { BooleanPropertySchemaObject } from './boolean-property-schema-object';
import { literal, recursion, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../../utils/types';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface ArraySchemaObject {
	readonly type: 'array';
	readonly items: SchemaObject;
}

const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	type({
		type: literal('array'),
		items: SchemaObjectCodec,
	}),
);

export interface ObjectSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Dictionary<SchemaObject>>;
	readonly required: Option<string[]>;
	readonly additionalProperties: Option<SchemaObject>;
}

const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	type({
		required: stringArrayOption,
		type: literal('object'),
		properties: optionFromNullable(dictionary(SchemaObjectCodec, 'Dictionary<SchemaObject>')),
		additionalProperties: optionFromNullable(SchemaObjectCodec),
	}),
);

export interface AllOfSchemaObject {
	readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
	readonly description: Option<string>;
}

export const AllOfSchemaObject: Codec<AllOfSchemaObject> = recursion('ReferenceOrAllOfSchemaObject', () =>
	type({
		description: stringOption,
		allOf: nonEmptyArray(union([ReferenceObject, SchemaObjectCodec])),
	}),
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
		StringPropertySchemaObject,
		NumberPropertySchemaObject,
		IntegerPropertySchemaObject,
		BooleanPropertySchemaObject,
	]),
);
