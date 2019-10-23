import { boolean, intersection, literal, partial, record, recursion, string, Type, type, union } from 'io-ts';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';

export interface BaseSchemaObject {
	readonly format?: string;
	readonly deprecated?: boolean;
}

const BaseSchemaObjectProps = {};
const PartialBaseSchemaObjectProps = {
	format: string,
	deprecated: boolean,
};

export interface PrimitiveSchemaObject extends BaseSchemaObject {
	readonly type: 'boolean' | 'string' | 'number' | 'integer';
}

const BooleanSchemaObjectCodec = intersection(
	[
		type({
			...BaseSchemaObjectProps,
			type: union([literal('boolean'), literal('string'), literal('number'), literal('integer')]),
		}),
		partial({
			...PartialBaseSchemaObjectProps,
		}),
	],
	'BooleanSchemaObjectCodec',
);

export interface ObjectSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties?: Record<string, ReferenceObject | SchemaObject>;
	readonly additionalProperties?: boolean | ReferenceObject | SchemaObject;
	readonly required?: string[];
}

const ObjectSchemaObjectCodec: Type<ObjectSchemaObject> = recursion('ObjectSchemaObject', () =>
	intersection(
		[
			type({
				...BaseSchemaObjectProps,
				type: literal('object'),
			}),
			partial({
				...PartialBaseSchemaObjectProps,
				properties: record(string, union([ReferenceObjectCodec, SchemaObjectCodec])),
				additionalProperties: union([boolean, ReferenceObjectCodec, SchemaObjectCodec]),
			}),
		],
		'ObjectSchemaObjectCodec',
	),
);

export interface ArraySchemaObject extends BaseSchemaObject {
	readonly type: 'array';
	readonly items: ReferenceObject | SchemaObject;
}

const ArraySchemaObjectCodec: Type<ArraySchemaObject> = recursion('ArraySchemaObject', () =>
	intersection(
		[
			type({
				...BaseSchemaObjectProps,
				type: literal('array'),
				items: union([ReferenceObjectCodec, SchemaObjectCodec]),
			}),
			partial({
				...PartialBaseSchemaObjectProps,
			}),
		],
		'ArraySchemaObjectCodec',
	),
);

export type SchemaObject = PrimitiveSchemaObject | ObjectSchemaObject | ArraySchemaObject;

export const SchemaObjectCodec: Type<SchemaObject> = recursion('SchemaObject', () =>
	union([BooleanSchemaObjectCodec, ObjectSchemaObjectCodec, ArraySchemaObjectCodec], 'SchemaObject'),
);
