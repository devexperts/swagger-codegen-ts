import { Codec, dictionary, stringArrayOption, stringOption } from '../../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject } from '../reference-object';
import { StringPropertySchemaObject } from './string-property-schema-object';
import { NumberPropertySchemaObject } from './number-property-schema-object';
import { IntegerPropertySchemaObject } from './integer-property-schema-object';
import { BooleanPropertySchemaObject } from './boolean-property-schema-object';
import { array, literal, recursion, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../../utils/types';

export interface ArraySchemaObject {
	readonly type: 'array';
	readonly items: SchemaObject;
}

const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	type({
		type: literal('array'),
		items: SchemaObject,
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
		properties: optionFromNullable(dictionary(SchemaObject, 'Dictionary<SchemaObject>')),
		additionalProperties: optionFromNullable(SchemaObject),
	}),
);

export interface AllOfSchemaObject {
	readonly allOf: SchemaObject[];
	readonly description: Option<string>;
}

export const AllOfSchemaObject: Codec<AllOfSchemaObject> = recursion('ReferenceOrAllOfSchemaObject', () =>
	type({
		description: stringOption,
		allOf: array(SchemaObject),
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

export const SchemaObject: Codec<SchemaObject> = recursion('SchemaObject', () =>
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
