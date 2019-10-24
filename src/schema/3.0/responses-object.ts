import { record, string, union } from 'io-ts';
import { ResponseObject, ResponseObjectCodec } from './response-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { Codec } from '../../utils/io-ts';

export interface ResponsesObject extends Record<string, ResponseObject | ReferenceObject> {}

export const ResponsesObjectCodec: Codec<ResponsesObject> = record(
	string,
	union([ReferenceObjectCodec, ResponseObjectCodec]),
	'ResponsesObject',
);
