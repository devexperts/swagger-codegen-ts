import { Dictionary } from '../../utils/types';
import { dictionary } from '../../utils/io-ts';
import { string } from 'io-ts';

export interface ScopesObject extends Dictionary<string> {}

export const ScopesObject = dictionary(string, 'ScopesObject');
