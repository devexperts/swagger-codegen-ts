import { Dictionary } from '../../utils/types';
import { SchemaObject, SchemaObjectCodec } from './schema-object/schema-object';
import { dictionary } from '../../utils/io-ts';

export interface DefinitionsObject extends Dictionary<SchemaObject> {}

export const DefinitionsObject = dictionary(SchemaObjectCodec, 'DefinitionsObject');
