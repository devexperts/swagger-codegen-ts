import { Nullable } from '../../../utils/nullable';
import { OpenAPIV3 } from 'openapi-types';
import { serializedType, SerializedType } from '../common/data/serialized-type';
import { parseRef, Ref } from '../../../utils/ref';
import * as path from 'path';
import { getIOName, getTypeName } from '../common/utils';
import { serializedDependency } from '../common/data/serialized-dependency';

export interface Context {
	readonly resolveRef: <A = unknown>(referenceObject: OpenAPIV3.ReferenceObject) => Nullable<A>;
}
