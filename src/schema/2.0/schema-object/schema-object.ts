import { Codec, dictionary, stringArrayOption, stringOption } from '../../../utils/io-ts';
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
import { array, intersection, literal, recursion, type, union } from 'io-ts';

export type SchemaObject =
	| ReferenceSchemaObject
	| AllOfSchemaObject
	| ObjectSchemaObject
	| StringPropertySchemaObject
	| NumberPropertySchemaObject
	| IntegerPropertySchemaObject
	| BooleanPropertySchemaObject
	| ArraySchemaObject;

export const SchemaObject: Codec<SchemaObject> = recursion('SchemaObject', SchemaObject => {
	const ArraySchemaObject = type({
		type: literal('array'),
		items: SchemaObject,
	});
	const ObjectSchemaObject = type({
		required: stringArrayOption,
		type: literal('object'),
		properties: optionFromNullable(dictionary(SchemaObject, 'Dictionary<SchemaObject>')),
		additionalProperties: optionFromNullable(SchemaObject),
	});
	const ReferenceOrAllOfSchemaObject = union([
		intersection([
			ReferenceObject,
			type({
				type: literal(undefined as any),
			}),
		]),
		type({
			description: stringOption,
			type: literal(undefined as any),
			allOf: array(SchemaObject),
		}),
	]);

	return union([
		ReferenceOrAllOfSchemaObject,
		ArraySchemaObject,
		ObjectSchemaObject,
		StringPropertySchemaObject,
		NumberPropertySchemaObject,
		IntegerPropertySchemaObject,
		BooleanPropertySchemaObject,
	]);
});
