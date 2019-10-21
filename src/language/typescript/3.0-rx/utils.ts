import { Nullable } from '../../../utils/nullable';
import { OpenAPIV3 } from 'openapi-types';
import { fromString } from '../../../utils/ref';

export interface Context {
	readonly resolveRef: <A = unknown>(referenceObject: OpenAPIV3.ReferenceObject) => Nullable<A>;
}

export const clientRef = fromString('client#/client'); // relative to output root so that all specs share the same client
