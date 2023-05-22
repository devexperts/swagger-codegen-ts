import { ResponseObject } from './response-object';
import { ReferenceObject } from './reference-object';
import { Codec } from '../../utils/io-ts';
export interface ResponsesObject extends Record<string, ResponseObject | ReferenceObject> {
}
export declare const ResponsesObjectCodec: Codec<ResponsesObject>;
