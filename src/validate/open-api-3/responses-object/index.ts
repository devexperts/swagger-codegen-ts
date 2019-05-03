import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { record, recursion, string, union } from 'io-ts';
import { ResponseObject, responseObjectIO } from '../response-object';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responsesObject
export type ResponsesObject = Record<string, ResponseObject | ReferenceObject>;
export const responsesObjectIO = recursion<ResponsesObject, unknown>('ResponsesObject', () =>
	record(string, union([responseObjectIO, referenceObjectIO])),
);
