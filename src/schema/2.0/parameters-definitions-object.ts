import { Dictionary } from '../../utils/types';
import { ParameterObject, ParameterObjectCodec } from './parameter-object';
import { dictionary } from '../../utils/io-ts';

export interface ParametersDefinitionsObject extends Dictionary<ParameterObject> {}

export const ParametersDefinitionsObject = dictionary(ParameterObjectCodec, 'ParametersDefinitionsObject');
