import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject, externalDocumentationObjectIO } from '../external-documentation-object';
import { ParameterObject, parameterObjectIO } from '../parameter-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { RequestBodyObject, requestBodyObjectIO } from '../request-body-object';
import { ResponsesObject, responsesObjectIO } from '../responses-object';
import { CallbackObject, callbackObjectIO } from '../callback-object';
import { SecurityRequirementObject, securityRequirementObjectIO } from '../security-requirement-object';
import { ServerObject, serverObjectIO } from '../server-object';
import { Any, array, boolean, record, recursion, RecursiveType, string, type, union } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#operationObject
export type OperationObject = {
	callbacks: Option<Record<string, (CallbackObject | ReferenceObject)[]>>;
	deprecated: Option<boolean>;
	description: Option<string>;
	externalDocs: Option<ExternalDocumentationObject>;
	operationId: Option<string>;
	parameters: Option<(ParameterObject | ReferenceObject)[]>;
	requestBody: Option<RequestBodyObject | ReferenceObject>;
	responses: ResponsesObject;
	security: Option<SecurityRequirementObject[]>;
	servers: Option<ServerObject[]>;
	summary: Option<string>;
	tags: Option<string[]>;
};
export const operationObjectIO: RecursiveType<Any, OperationObject, unknown> = recursion('OperationObject', () =>
	type({
		callbacks: createOptionFromNullable(record(string, array(union([callbackObjectIO, referenceObjectIO])))),
		deprecated: createOptionFromNullable(boolean),
		description: createOptionFromNullable(string),
		externalDocs: createOptionFromNullable(externalDocumentationObjectIO),
		operationId: createOptionFromNullable(string),
		parameters: createOptionFromNullable(array(union([parameterObjectIO, referenceObjectIO]))),
		requestBody: createOptionFromNullable(union([requestBodyObjectIO, referenceObjectIO])),
		responses: responsesObjectIO,
		security: createOptionFromNullable(array(securityRequirementObjectIO)),
		servers: createOptionFromNullable(array(serverObjectIO)),
		summary: createOptionFromNullable(string),
		tags: createOptionFromNullable(array(string)),
	}),
);
