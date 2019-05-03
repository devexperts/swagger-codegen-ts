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
	allowEmptyValue: Option<boolean>;
	deprecated: Option<boolean>;
	description: Option<string>;
	required: Option<boolean>;

	// schema: ref
	allowReserved: Option<boolean>;
	example: Option<unknown>;
	examples: Option<Record<string, ExampleObject | ReferenceObject>>;
	explode: Option<boolean>;
	schema: Option<SchemaObject | ReferenceObject>;
	style: Option<string>;

	//schema: content
	content: Option<Record<string, MediaTypeObject>>;
};
export const parameterObjectCommonIO = type(
	{
		allowEmptyValue: createOptionFromNullable(boolean),
		deprecated: createOptionFromNullable(boolean),
		description: createOptionFromNullable(string),
		required: createOptionFromNullable(boolean),

		// schema: ref
		allowReserved: createOptionFromNullable(boolean),
		example: createOptionFromNullable(unknown),
		examples: createOptionFromNullable(record(string, union([exampleObjectIO, referenceObjectIO]))),
		explode: createOptionFromNullable(boolean),
		schema: createOptionFromNullable(union([schemaObjectIO, referenceObjectIO])),
		style: createOptionFromNullable(string),

		//schema: content
		content: createOptionFromNullable(record(string, mediaTypeObjectIO)),
	},
	'ParameterObjectCommon',
);

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject
export type ParameterObject = ParameterObjectSpecific & ParameterObjectCommon;
export const parameterObjectIO = intersection([parameterObjectCommonIO, parameterObjectSpecificIO], 'ParameterObject');
