import { SchemaObject } from './schema-object';

export interface ArraySchemaObject {
	readonly type: 'array';
	readonly items: SchemaObject;
}
