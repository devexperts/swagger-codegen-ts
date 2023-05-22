import { Dictionary } from '../../utils/types';
import { ParameterObject } from './parameter-object';
export interface ParametersDefinitionsObject extends Dictionary<ParameterObject> {
}
export declare const ParametersDefinitionsObject: import("io-ts").RecordC<import("io-ts").StringC, import("../../utils/io-ts").Codec<ParameterObject>>;
