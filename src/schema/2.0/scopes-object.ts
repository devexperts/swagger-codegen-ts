import { Dictionary } from '../../utils/types';
import * as t from 'io-ts';

export interface ScopesObject extends Dictionary<string> {}

export const ScopesObject = t.record(t.string, t.string, 'ScopesObject');
