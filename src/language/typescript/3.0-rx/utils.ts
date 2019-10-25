import { ReferenceObject } from '../../../schema/3.0/reference-object';

export interface Context {
	readonly resolveRef: (referenceObject: ReferenceObject) => unknown;
}
