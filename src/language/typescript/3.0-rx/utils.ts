import { Nullable } from '../../../utils/nullable';
import { OpenAPIV3 } from 'openapi-types';
import { SerializedType } from '../common/data/serialized-type';
import { Ref } from '../../../utils/ref';

export interface Context {
	readonly serializeRef: (cwd: string) => (ref: Ref) => SerializedType;
	readonly resolveRef: <A = unknown>(referenceObject: OpenAPIV3.ReferenceObject) => Nullable<A>;
}
