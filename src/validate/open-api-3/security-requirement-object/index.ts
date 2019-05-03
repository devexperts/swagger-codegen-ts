import { array, record, string } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#securityRequirementObject
export type SecurityRequirementObject = Record<string, string[]>;
export const securityRequirementObjectIO = record(string, array(string), 'SecurityRequirementObject');
