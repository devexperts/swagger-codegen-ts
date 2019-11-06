import { array, boolean, literal, record, recursion, string, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Codec } from '../../utils/io-ts';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface BaseSchemaObject {
	readonly format: Option<string>;
	readonly deprecated: Option<boolean>;
}

const BaseSchemaObjectProps = {
	format: optionFromNullable(string),
	deprecated: optionFromNullable(boolean),
};

export interface PrimitiveSchemaObject extends BaseSchemaObject {
	readonly type: 'boolean' | 'string' | 'number' | 'integer';
}

const PrimitiveSchemaObjectCodec: Codec<PrimitiveSchemaObject> = type(
	{
		...BaseSchemaObjectProps,
		type: union([literal('boolean'), literal('string'), literal('number'), literal('integer')]),
	},
	'PrimitiveSchemaObject',
);

export interface ObjectSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Record<string, ReferenceObject | SchemaObject>>;
	readonly additionalProperties: Option<boolean | ReferenceObject | SchemaObject>;
	readonly required: Option<string[]>;
}

const ObjectSchemaObjectCodec: Codec<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	type({
		...BaseSchemaObjectProps,
		type: literal('object'),
		properties: optionFromNullable(record(string, union([ReferenceObjectCodec, SchemaObjectCodec]))),
		additionalProperties: optionFromNullable(union([boolean, ReferenceObjectCodec, SchemaObjectCodec])),
		required: optionFromNullable(array(string)),
	}),
);

export interface ArraySchemaObject extends BaseSchemaObject {
	readonly type: 'array';
	readonly items: ReferenceObject | SchemaObject;
}

const ArraySchemaObjectCodec: Codec<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	type({
		...BaseSchemaObjectProps,
		type: literal('array'),
		items: union([ReferenceObjectCodec, SchemaObjectCodec]),
	}),
);

export interface AllOfSchemaObject extends BaseSchemaObject {
	readonly allOf: NonEmptyArray<ReferenceObject | SchemaObject>;
}

export const AllOfSchemaObjectCodec: Codec<AllOfSchemaObject> = recursion('AllOfSchemaObject', () =>
	type({
		...BaseSchemaObjectProps,
		allOf: nonEmptyArray(union([ReferenceObjectCodec, SchemaObjectCodec])),
	}),
);

export type SchemaObject = PrimitiveSchemaObject | ObjectSchemaObject | ArraySchemaObject | AllOfSchemaObject;

export const SchemaObjectCodec: Codec<SchemaObject> = recursion('SchemaObject', () =>
	union([PrimitiveSchemaObjectCodec, ObjectSchemaObjectCodec, ArraySchemaObjectCodec, AllOfSchemaObjectCodec]),
);
