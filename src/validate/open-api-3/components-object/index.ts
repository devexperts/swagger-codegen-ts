import { SchemaObject, schemaObjectIO } from '../schema-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { HeaderObject, headerObjectIO } from '../header-object';
import { ExampleObject, exampleObjectIO } from '../example-object';
import { ParameterObject, parameterObjectIO } from '../parameter-object';
import { record, string, type, union, unknown } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#componentsObject
export type ComponentsObject = {
	callbacks: Option<unknown>; // TODO
	examples: Option<Record<string, ExampleObject | ReferenceObject>>;
	headers: Option<Record<string, HeaderObject | ReferenceObject>>;
	links: Option<unknown>; // TODO
	parameters: Option<Record<string, ParameterObject | ReferenceObject>>;
	requestBodies: Option<unknown>; // TODO
	responses: Option<unknown>; // TODO
	schemas: Option<Record<string, SchemaObject | ReferenceObject>>;
	securitySchemes: Option<unknown>; // TODO
};

export const componentsObjectIO = type(
	{
		callbacks: createOptionFromNullable(record(string, unknown)),
		examples: createOptionFromNullable(record(string, union([exampleObjectIO, referenceObjectIO]))),
		headers: createOptionFromNullable(record(string, union([headerObjectIO, referenceObjectIO]))),
		links: createOptionFromNullable(record(string, unknown)),
		parameters: createOptionFromNullable(record(string, union([parameterObjectIO, referenceObjectIO]))),
		requestBodies: createOptionFromNullable(record(string, unknown)),
		responses: createOptionFromNullable(record(string, unknown)),
		schemas: createOptionFromNullable(record(string, union([schemaObjectIO, referenceObjectIO]))),
		securitySchemes: createOptionFromNullable(record(string, unknown)),
	},
	'ComponentsObject',
);
