import { Dictionary } from '../../utils/types';
import { SchemaObject } from './schema-object';
export interface DefinitionsObject extends Dictionary<SchemaObject> {
}
export declare const DefinitionsObject: import("io-ts").RecordC<import("io-ts").StringC, import("../../utils/io-ts").Codec<SchemaObject>>;
