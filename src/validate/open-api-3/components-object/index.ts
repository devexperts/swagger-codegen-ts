import { SchemaObject, schemaObjectIO } from '../schema-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { HeaderObject, headerObjectIO } from '../header-object';
import { ExampleObject, exampleObjectIO } from '../example-object';
import { ParameterObject, parameterObjectIO } from '../parameter-object';
import { record, string, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { createOptionFromNullable } from 'io-ts-types';
import { CallbackObject, callbackObjectIO } from '../callback-object';
import { LinkObject, linkObjectIO } from '../link-object';
import { RequestBodyObject, requestBodyObjectIO } from '../request-body-object';
import { ResponseObject, responseObjectIO } from '../response-object';
import { SecuritySchemeObject, securityShemeObjectIO } from '../security-scheme-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#componentsObject
export type ComponentsObject = {
	callbacks: Option<Record<string, CallbackObject | ReferenceObject>>;
	examples: Option<Record<string, ExampleObject | ReferenceObject>>;
	headers: Option<Record<string, HeaderObject | ReferenceObject>>;
	links: Option<Record<string, LinkObject | ReferenceObject>>;
	parameters: Option<Record<string, ParameterObject | ReferenceObject>>;
	requestBodies: Option<Record<string, RequestBodyObject | ReferenceObject>>;
	responses: Option<Record<string, ResponseObject | ReferenceObject>>;
	schemas: Option<Record<string, SchemaObject | ReferenceObject>>;
	securitySchemes: Option<Record<string, SecuritySchemeObject | ReferenceObject>>;
};

export const componentsObjectIO = type(
	{
		callbacks: createOptionFromNullable(record(string, union([callbackObjectIO, referenceObjectIO]))),
		examples: createOptionFromNullable(record(string, union([exampleObjectIO, referenceObjectIO]))),
		headers: createOptionFromNullable(record(string, union([headerObjectIO, referenceObjectIO]))),
		links: createOptionFromNullable(record(string, union([linkObjectIO, referenceObjectIO]))),
		parameters: createOptionFromNullable(record(string, union([parameterObjectIO, referenceObjectIO]))),
		requestBodies: createOptionFromNullable(record(string, union([requestBodyObjectIO, referenceObjectIO]))),
		responses: createOptionFromNullable(record(string, union([responseObjectIO, referenceObjectIO]))),
		schemas: createOptionFromNullable(record(string, union([schemaObjectIO, referenceObjectIO]))),
		securitySchemes: createOptionFromNullable(record(string, union([securityShemeObjectIO, referenceObjectIO]))),
	},
	'ComponentsObject',
);
