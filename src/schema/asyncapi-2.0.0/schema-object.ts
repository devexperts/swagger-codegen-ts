import {
	Codec,
	natural,
	Natural,
	nonEmptySetFromArray,
	NonEmptySet,
	positive,
	Positive,
	JSONPrimitive,
	JSONPrimitiveCodec,
} from '../../utils/io-ts';
import { boolean, intersection, literal, number, record, recursion, string, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { ordString } from 'fp-ts/lib/Ord';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';

export interface BaseSchemaObject {
	externalDocs: Option<ExternalDocumentationObject>;
	deprecated: Option<boolean>;
}
export const BaseSchemaObjectCodec: Codec<BaseSchemaObject> = type(
	{
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
		deprecated: optionFromNullable(boolean),
	},
	'BaseSchemaObject',
);

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

export interface ConstSchemaObject extends BaseSchemaObject {
	readonly const: JSONPrimitive;
}
export const ConstSchemaObjectCodec: Codec<ConstSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			const: JSONPrimitiveCodec,
		}),
	],
	'ConstSchemaObject',
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

export interface BasePrimitiveSchemaObject extends BaseSchemaObject {
	readonly format: Option<string>;
}
export const BasePrimitiveSchemaObjectCodec: Codec<BasePrimitiveSchemaObject> = intersection(
	[
		BaseSchemaObjectCodec,
		type({
			format: optionFromNullable(string),
		}),
	],
	'BasePrimitiveSchemaObject',
);

export interface NullSchemaObject extends BasePrimitiveSchemaObject {
	readonly type: 'null';
}
const NullSchemaObjectCodec: Codec<NullSchemaObject> = intersection(
	[
		BasePrimitiveSchemaObjectCodec,
		type({
			type: literal('null'),
		}),
	],
	'NullSchemaObject',
);

export interface BooleanSchemaObject extends BasePrimitiveSchemaObject {
	readonly type: 'boolean';
}
const BooleanSchemaObjectCodec: Codec<BooleanSchemaObject> = intersection(
	[
		BasePrimitiveSchemaObjectCodec,
		type({
			type: literal('boolean'),
		}),
	],
	'BooleanSchemaObject',
);

export interface BaseNumericSchemaObject extends BasePrimitiveSchemaObject {
	readonly multipleOf: Option<Positive>;
	readonly maximum: Option<number>;
	readonly exclusiveMaximum: Option<number>;
	readonly minimum: Option<number>;
	readonly exclusiveMinimum: Option<number>;
}
const BaseNumericSchemaObjectCodec: Codec<BaseNumericSchemaObject> = intersection(
	[
		BasePrimitiveSchemaObjectCodec,
		type({
			multipleOf: optionFromNullable(positive),
			maximum: optionFromNullable(number),
			exclusiveMaximum: optionFromNullable(number),
			minimum: optionFromNullable(number),
			exclusiveMinimum: optionFromNullable(number),
		}),
	],
	'BaseNumericSchemaObject',
);

export interface NumberSchemaObject extends BaseNumericSchemaObject {
	readonly type: 'number';
}
const NumberSchemaObjectCodec: Codec<NumberSchemaObject> = intersection(
	[
		BaseNumericSchemaObjectCodec,
		type({
			type: literal('number'),
		}),
	],
	'NumberSchemaObject',
);

export interface IntegerSchemaObject extends BaseNumericSchemaObject {
	readonly type: 'integer';
}
const IntegerSchemaObjectCodec: Codec<IntegerSchemaObject> = intersection(
	[
		BaseNumericSchemaObjectCodec,
		type({
			type: literal('integer'),
		}),
	],
	'IntegerSchemaObject',
);

export interface StringSchemaObject extends BasePrimitiveSchemaObject {
	readonly type: 'string';
	readonly maxLength: Option<Natural>;
	readonly minLength: Option<Natural>;
	readonly pattern: Option<string>;
}
const StringSchemaObjectCodec: Codec<StringSchemaObject> = intersection(
	[
		BasePrimitiveSchemaObjectCodec,
		type({
			type: literal('string'),
			maxLength: optionFromNullable(natural),
			minLength: optionFromNullable(natural),
			pattern: optionFromNullable(string),
		}),
	],
	'StringSchemaObject',
);

export interface ArraySchemaObject extends BaseSchemaObject {
	readonly type: 'array';
	readonly items: ReferenceObject | SchemaObject;
	readonly maxItems: Option<Natural>;
	readonly minItems: Option<Natural>;
}
const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			type: literal('array'),
			items: union([ReferenceObjectCodec, SchemaObjectCodec]),
			maxItems: optionFromNullable(natural),
			minItems: optionFromNullable(natural),
		}),
	]),
);

export interface ObjectSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Record<string, ReferenceObject | SchemaObject>>;
	readonly additionalProperties: Option<ReferenceObject | SchemaObject>;
	readonly required: Option<NonEmptySet<string>>;
}

export const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	intersection([
		BaseSchemaObjectCodec,
		type({
			type: literal('object'),
			properties: optionFromNullable(record(string, union([ReferenceObjectCodec, SchemaObjectCodec]))),
			additionalProperties: optionFromNullable(union([ReferenceObjectCodec, SchemaObjectCodec])),
			required: optionFromNullable(nonEmptySetFromArray(string, ordString)),
		}),
	]),
);

export type SchemaObject =
	| EnumSchemaObject
	| ConstSchemaObject
	| AllOfSchemaObject
	| OneOfSchemaObject
	| NullSchemaObject
	| BooleanSchemaObject
	| NumberSchemaObject
	| IntegerSchemaObject
	| StringSchemaObject
	| ArraySchemaObject
	| ObjectSchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([
		EnumSchemaObjectCodec,
		ConstSchemaObjectCodec,
		AllOfSchemaObjectCodec,
		OneOfSchemaObjectCodec,
		NullSchemaObjectCodec,
		BooleanSchemaObjectCodec,
		NumberSchemaObjectCodec,
		IntegerSchemaObjectCodec,
		StringSchemaObjectCodec,
		ArraySchemaObjectCodec,
		ObjectSchemaObjectCodec,
	]),
);
