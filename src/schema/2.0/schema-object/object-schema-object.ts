import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../../utils/types';
import { SchemaObject } from './schema-object';

export interface ObjectSchemaObject {
	readonly type: 'object';
	readonly properties: Option<Dictionary<SchemaObject>>;
	readonly required: Option<string[]>;
	readonly additionalProperties: Option<SchemaObject>;
}
