import { Branded } from 'io-ts';
import { Codec } from '../../utils/io-ts';
import { ReferenceObject } from './reference-object';
import { ParameterObject } from './parameter-object';
export interface ParametersObjectFieldPatternBrand {
    readonly ParametersObjectFieldPattern: unique symbol;
}
export declare type ParametersObjectPattern = Branded<string, ParametersObjectFieldPatternBrand>;
export interface ParametersObject extends Record<ParametersObjectPattern, ReferenceObject | ParameterObject> {
}
export declare const ParametersObjectCodec: Codec<ParametersObject>;
