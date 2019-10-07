import { Dictionary } from '../../utils/types';
import * as t from 'io-ts';

export interface ExampleObject extends Dictionary<string> {}

export const ExampleObject = t.record(t.string, t.string, 'ExampleObject');
