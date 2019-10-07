import { Dictionary } from '../../utils/types';
import * as t from 'io-ts';

export interface SecurityRequirementObject extends Dictionary<string[]> {}

export const SecurityRequirementObject = t.record(t.string, t.array(t.string), 'SecurityRequirementObject');
