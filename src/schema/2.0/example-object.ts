import { Dictionary } from '../../utils/types';
import { dictionary } from '../../utils/io-ts';
import { string } from 'io-ts';

export interface ExampleObject extends Dictionary<string> {}

export const ExampleObject = dictionary(string, 'ExampleObject');
