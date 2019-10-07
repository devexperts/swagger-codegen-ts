import { Dictionary } from '../../utils/types';
import { PathItemObject } from './path-item-object';
import * as t from 'io-ts';

export interface PathsObject extends Dictionary<PathItemObject> {}

export const PathsObject = t.record(t.string, PathItemObject, 'PathsObject');
