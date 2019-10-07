import { Dictionary } from '../../utils/types';
import { ParameterObject } from './parameter-object/parameter-object';
import { dictionary } from '../../utils/io-ts';

export interface ParametersDefinitionsObject extends Dictionary<ParameterObject> {}

export const ParametersDefinitionsObject = dictionary(ParameterObject, 'ParametersDefinitionsObject');
