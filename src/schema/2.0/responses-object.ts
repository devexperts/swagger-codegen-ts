import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
import { dictionary } from '../../utils/io-ts';

export interface ResponsesObject extends Dictionary<ResponseObject> {}

export const ResponsesObject = dictionary(ResponseObject, 'ResponsesObject');
