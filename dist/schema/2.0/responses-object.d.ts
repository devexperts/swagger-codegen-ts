import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
import { Codec } from '../../utils/io-ts';
import { ReferenceObject } from './reference-object';
export interface ResponsesObject extends Dictionary<ReferenceObject | ResponseObject> {
}
export declare const ResponsesObject: Codec<ResponsesObject>;
