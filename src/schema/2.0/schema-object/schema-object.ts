import * as t from 'io-ts';
import { dictionary, stringArrayOption, stringOption } from '../../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ReferenceObject } from '../reference-object';
import { StringPropertySchemaObject } from './string-property-schema-object';
import { NumberPropertySchemaObject } from './number-property-schema-object';
import { IntegerPropertySchemaObject } from './integer-property-schema-object';
import { BooleanPropertySchemaObject } from './boolean-property-schema-object';
import { ReferenceSchemaObject } from './reference-schema-object';
import { AllOfSchemaObject } from './all-of-schema-object';
import { ObjectSchemaObject } from './object-schema-object';
import { ArraySchemaObject } from './array-schema-object';

export type SchemaObject =
	| ReferenceSchemaObject
	| AllOfSchemaObject
	| ObjectSchemaObject
	| StringPropertySchemaObject
	| NumberPropertySchemaObject
	| IntegerPropertySchemaObject
	| BooleanPropertySchemaObject
	| ArraySchemaObject;

export const SchemaObject = t.recursion<SchemaObject, unknown>('SchemaObject', SchemaObject => {
	const ArraySchemaObject = t.type({
		type: t.literal('array'),
		items: SchemaObject,
	});
	const ObjectSchemaObject = t.type({
		required: stringArrayOption,
		type: t.literal('object'),
		properties: optionFromNullable(dictionary(SchemaObject, 'Dictionary<SchemaObject>')),
		additionalProperties: optionFromNullable(SchemaObject),
	});
	const ReferenceOrAllOfSchemaObject = t.union([
		t.intersection([
			ReferenceObject,
			t.type({
				type: t.literal(undefined as any),
			}),
		]),
		t.type({
			description: stringOption,
			type: t.literal(undefined as any),
			allOf: t.array(SchemaObject),
		}),
	]);

	return t.union([
		ReferenceOrAllOfSchemaObject,
		ArraySchemaObject,
		ObjectSchemaObject,
		StringPropertySchemaObject,
		NumberPropertySchemaObject,
		IntegerPropertySchemaObject,
		BooleanPropertySchemaObject,
	]);
});
