import { Dictionary } from '../../utils/types';
import { SchemaObject } from './schema-object/schema-object';
import { dictionary } from '../../utils/io-ts';

export interface DefinitionsObject extends Dictionary<SchemaObject> {}

export const DefinitionsObject = dictionary(SchemaObject, 'DefinitionsObject');
