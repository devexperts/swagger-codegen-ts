import { Option } from 'fp-ts/lib/Option';
import { SchemaObject } from './schema-object';

export interface AllOfSchemaObject {
	readonly allOf: SchemaObject[];
	readonly description: Option<string>;
	readonly type: undefined;
}
