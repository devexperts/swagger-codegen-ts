import { record, string } from 'io-ts';
import { PathItemObject, PathItemObjectCodec } from './path-item-object';

export interface PathsObject extends Record<string, PathItemObject> {}

export const PathsObjectCodec = record(string, PathItemObjectCodec, 'PathsObject');
