import { Dictionary } from '../../utils/types';
import { PathItemObject } from './path-item-object';
import { dictionary } from '../../utils/io-ts';

export interface PathsObject extends Dictionary<PathItemObject> {}

export const PathsObject = dictionary(PathItemObject, 'PathsObject');
