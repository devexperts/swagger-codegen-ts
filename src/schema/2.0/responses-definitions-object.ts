import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
import * as t from 'io-ts';

export interface ResponsesDefinitionsObject extends Dictionary<ResponseObject> {}

export const ResponsesDefinitionsObject = t.record(t.string, ResponseObject, 'ResponsesDefinitionsObject');
