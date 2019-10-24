import { record, string } from 'io-ts';
import { PathItemObject, PathItemObjectCodec } from './path-item-object';
import { Codec } from '../../utils/io-ts';

export interface PathsObject extends Record<string, PathItemObject> {}

export const PathsObjectCodec: Codec<PathsObject> = record(string, PathItemObjectCodec, 'PathsObject');
