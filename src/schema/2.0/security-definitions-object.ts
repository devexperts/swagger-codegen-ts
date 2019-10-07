import { Dictionary } from '../../utils/types';
import { SecuritySchemeObject } from './security-scheme-object/security-scheme-object';
import * as t from 'io-ts';

export interface SecurityDefinitionsObject extends Dictionary<SecuritySchemeObject> {}

export const SecurityDefinitionsObject = t.record(t.string, SecuritySchemeObject, 'SecurityDefinitionsObject');
