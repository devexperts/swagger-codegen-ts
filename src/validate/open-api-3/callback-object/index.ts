import { PathItemObject, pathItemObjectIO } from '../path-item-object';
import { record, string } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#callbackObject
export type CallbackObject = Record<string, PathItemObject>;
export const callbackObjectIO = record(string, pathItemObjectIO, 'CallbackObject');
