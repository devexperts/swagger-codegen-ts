import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
import { dictionary } from '../../utils/io-ts';

export interface ResponsesDefinitionsObject extends Dictionary<ResponseObject> {}

export const ResponsesDefinitionsObject = dictionary(ResponseObject, 'ResponsesDefinitionsObject');
