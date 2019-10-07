import { Dictionary } from '../../utils/types';
import { dictionary } from '../../utils/io-ts';
import { array, string } from 'io-ts';

export interface SecurityRequirementObject extends Dictionary<string[]> {}

export const SecurityRequirementObject = dictionary(array(string), 'SecurityRequirementObject');
