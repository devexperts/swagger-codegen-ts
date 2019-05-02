import { Option } from 'fp-ts/lib/Option';
import { boolean, intersection, record, string, type, union, unknown } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';
import { ParameterIn, parameterInIO } from './parameter-in';
import { ExampleObject, exampleObjectIO } from '../example-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { SchemaObject, schemaObjectIO } from '../schema-object';
import { MediaTypeObject, mediaTypeObjectIO } from '../media-type-object';

// this parameters are separated because there is HeaderObject that has the same structure as ParametersObject except this 2 parameters
export type ParameterObjectSpecific = {
	in: ParameterIn;
	name: string;
};
export const parameterObjectSpecificIO = type(
	{
		in: parameterInIO,
		name: string,
	},
	'ParameterObjectSpecific',
);

export type ParameterObjectCommon = {
	description: Option<string>;
	deprecated: Option<boolean>;
	required: Option<boolean>;
	allowEmptyValue: Option<boolean>;

	// schema: ref
	style: Option<string>;
	explode: Option<boolean>;
	allowReserved: Option<boolean>;
	schema: Option<SchemaObject | ReferenceObject>;
	example: Option<unknown>;
	examples: Option<Record<string, ExampleObject | ReferenceObject>>;

	//schema: content
	content: Record<string, MediaTypeObject>;
};
export const parameterObjectCommonIO = type(
	{
		description: createOptionFromNullable(string),
		deprecated: createOptionFromNullable(boolean),
		required: createOptionFromNullable(boolean),
		allowEmptyValue: createOptionFromNullable(boolean),

		// schema: ref
		style: createOptionFromNullable(string),
		explode: createOptionFromNullable(boolean),
		allowReserved: createOptionFromNullable(boolean),
		schema: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
		example: createOptionFromNullable(unknown),
		examples: createOptionFromNullable(record(string, union([exampleObjectIO, referenceObjectIO]))),

		//schema: content
		content: record(string, mediaTypeObjectIO),
	},
	'ParameterObjectCommon',
);

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject
export type ParameterObject = ParameterObjectSpecific & ParameterObjectCommon;
export const parameterObjectIO = intersection([parameterObjectCommonIO, parameterObjectSpecificIO], 'ParameterObject');
