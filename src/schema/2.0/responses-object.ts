import { Dictionary } from '../../utils/types';
import { ResponseObject } from './response-object';
import * as t from 'io-ts';

export interface ResponsesObject extends Dictionary<ResponseObject> {}

export const ResponsesObject = t.record(t.string, ResponseObject, 'ResponsesObject');
