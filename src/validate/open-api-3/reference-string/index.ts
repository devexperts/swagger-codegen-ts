import { InternalRef, internalRefIO } from './internal-ref';
import { externalRefIO, ExternalRef } from './external-ref';
import { union } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#referenceObject
export type ReferenceString = InternalRef | ExternalRef;
export const ReferenceStringIO = union([internalRefIO, externalRefIO], 'ReferenceString');
