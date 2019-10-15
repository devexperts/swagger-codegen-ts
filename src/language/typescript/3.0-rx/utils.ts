import { Nullable } from '../../../utils/nullable';
import { OpenAPIV3 } from 'openapi-types';
import { SerializedType } from '../common/data/serialized-type';

export interface Context {
	readonly serializeRef: (cwd: string) => (referenceObject: OpenAPIV3.ReferenceObject) => Nullable<SerializedType>;
	readonly resolveRef: <A = unknown>(referenceObject: OpenAPIV3.ReferenceObject) => Nullable<A>;
}
