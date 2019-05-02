import { type } from 'io-ts';
import { ReferenceString, ReferenceStringIO } from '../reference-string';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#referenceObject
export type ReferenceObject = { $ref: ReferenceString };
export const referenceObjectIO = type({ $ref: ReferenceStringIO }, 'ReferenceObject');
