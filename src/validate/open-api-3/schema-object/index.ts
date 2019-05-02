import { array, boolean, number, record, recursion, string, type, union, unknown } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { createNonEmptyArrayFromArray, createOptionFromNullable } from 'io-ts-types';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { regexp } from 'io-ts-types/lib/regexp';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { DiscriminatorObject, discriminatorObjectIO } from '../discriminator-object';
import { XMLObject, xmlObjectIO } from '../xml-object';
import { ExternalDocumentationObject, externalDocumentationObjectIO } from '../external-documentation-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject
export type SchemaObject = {
	// The following properties are taken directly from the JSON Schema definition and follow the same specifications
	enum: Option<NonEmptyArray<string>>;
	exclusiveMaximum: Option<boolean>;
	exclusiveMinimum: Option<boolean>;
	maximum: Option<number>;
	maxItems: Option<number>;
	maxLength: Option<number>;
	maxProperties: Option<number>;
	minimum: Option<number>;
	minItems: Option<number>;
	minLength: Option<number>;
	minProperties: Option<number>;
	multipleOf: Option<number>;
	pattern: Option<RegExp>;
	required: Option<NonEmptyArray<string>>;
	title: Option<string>;
	uniqueItems: Option<boolean>;

	// The following properties are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification
	additionalProperties: Option<SchemaObject | ReferenceObject>;
	allOf: Option<(SchemaObject | ReferenceObject)[]>;
	anyOf: Option<(SchemaObject | ReferenceObject)[]>;
	default: Option<unknown>;
	description: Option<string>;
	format: Option<string>;
	items: Option<SchemaObject | ReferenceObject>;
	not: Option<SchemaObject | ReferenceObject>;
	oneOf: Option<(SchemaObject | ReferenceObject)[]>;
	properties: Option<Record<string, SchemaObject | ReferenceObject>>;
	type: Option<string>;

	// Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation
	deprecated: Option<boolean>;
	discriminator: Option<DiscriminatorObject>;
	example: Option<unknown>;
	externalDocs: Option<ExternalDocumentationObject>;
	readOnly: Option<boolean>;
	writeOnly: Option<boolean>;
	xml: Option<XMLObject>;
};
export const schemaObjectIO = recursion<SchemaObject, unknown>('SchemaObject', schemaObjectIO =>
	type(
		{
			enum: createOptionFromNullable(createNonEmptyArrayFromArray(string)),
			exclusiveMaximum: createOptionFromNullable(boolean),
			exclusiveMinimum: createOptionFromNullable(boolean),
			maximum: createOptionFromNullable(number),
			maxItems: createOptionFromNullable(number),
			maxLength: createOptionFromNullable(number),
			maxProperties: createOptionFromNullable(number),
			minimum: createOptionFromNullable(number),
			minItems: createOptionFromNullable(number),
			minLength: createOptionFromNullable(number),
			minProperties: createOptionFromNullable(number),
			multipleOf: createOptionFromNullable(number),
			pattern: createOptionFromNullable(regexp),
			required: createOptionFromNullable(createNonEmptyArrayFromArray(string)),
			title: createOptionFromNullable(string),
			uniqueItems: createOptionFromNullable(boolean),

			additionalProperties: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
			allOf: createOptionFromNullable(array(union([schemaObjectIO, referenceObjectIO]))),
			anyOf: createOptionFromNullable(array(union([schemaObjectIO, referenceObjectIO]))),
			default: createOptionFromNullable(unknown),
			description: createOptionFromNullable(string),
			format: createOptionFromNullable(string),
			items: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
			not: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
			oneOf: createOptionFromNullable(array(union([schemaObjectIO, referenceObjectIO]))),
			properties: createOptionFromNullable(record(string, union([schemaObjectIO, referenceObjectIO]))),
			type: createOptionFromNullable(string),

			deprecated: createOptionFromNullable(boolean),
			discriminator: createOptionFromNullable(discriminatorObjectIO),
			example: createOptionFromNullable(unknown),
			externalDocs: createOptionFromNullable(externalDocumentationObjectIO),
			readOnly: createOptionFromNullable(boolean),
			writeOnly: createOptionFromNullable(boolean),
			xml: createOptionFromNullable(xmlObjectIO),
		},
		'SchemaObject',
	),
);
