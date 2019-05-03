import { ParameterObjectCommon, parameterObjectCommonIO } from '../parameter-object';
import { recursion } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#headerObject
export type HeaderObject = ParameterObjectCommon;
export const headerObjectIO = recursion<HeaderObject, unknown>('HeaderObject', () => parameterObjectCommonIO);
