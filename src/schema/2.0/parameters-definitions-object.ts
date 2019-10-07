import { Dictionary } from '../../utils/types';
import { ParameterObject } from './parameter-object/parameter-object';
import * as t from 'io-ts';

export interface ParametersDefinitionsObject extends Dictionary<ParameterObject> {}

export const ParametersDefinitionsObject = t.record(t.string, ParameterObject, 'ParametersDefinitionsObject');
