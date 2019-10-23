import { Nullable } from '../../../utils/nullable';
import { fromString } from '../../../utils/ref';
import { ReferenceObject } from '../../../schema/3.0/reference-object';

export interface Context {
	readonly resolveRef: (referenceObject: ReferenceObject) => Nullable<unknown>;
}

export const clientRef = fromString('client#/client'); // relative to output root so that all specs share the same client
