import { Nullable } from '../../../utils/nullable';
import { OpenAPIV3 } from 'openapi-types';

export interface Context {
	readonly resolveRef: <A = unknown>(referenceObject: OpenAPIV3.ReferenceObject) => Nullable<A>;
}
