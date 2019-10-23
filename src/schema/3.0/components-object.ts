import { type } from 'io-ts';
import { ReferenceObject } from './reference-object';
import { SchemaObject } from './schema-object';

export interface ComponentsObject {
	readonly schemas?: Record<string, ReferenceObject | SchemaObject>;
}

export const ComponentsObjectCodec = type({}, 'ComponentsObject');
