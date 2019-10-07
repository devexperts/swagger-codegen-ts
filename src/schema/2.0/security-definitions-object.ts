import { Dictionary } from '../../utils/types';
import { SecuritySchemeObject } from './security-scheme-object/security-scheme-object';
import { dictionary } from '../../utils/io-ts';

export interface SecurityDefinitionsObject extends Dictionary<SecuritySchemeObject> {}

export const SecurityDefinitionsObject = dictionary(SecuritySchemeObject, 'SecurityDefinitionsObject');
