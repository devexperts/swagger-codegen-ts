import { pathField, PathField } from '../path-field';
import { PathItemObject, pathItemObjectIO } from '../path-item-object';
import { record } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#pathsObject
export type PathsObject = Record<PathField, PathItemObject>;
export const pathsObjectIO = record(pathField, pathItemObjectIO, 'PathsObject');
