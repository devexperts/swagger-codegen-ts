import { record, string, Type, union } from 'io-ts';
import { ResponseObject, ResponseObjectCodec } from './response-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';

export interface ResponsesObject extends Record<string, ResponseObject | ReferenceObject> {}

export const ResponsesObjectCodec: Type<ResponsesObject> = record(
	string,
	union([ReferenceObjectCodec, ResponseObjectCodec]),
	'ResponsesObject',
);
