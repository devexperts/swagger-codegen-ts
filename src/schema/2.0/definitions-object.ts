import { Dictionary } from '../../utils/types';
import { SchemaObject } from './schema-object/schema-object';
import * as t from 'io-ts';

export interface DefinitionsObject extends Dictionary<SchemaObject> {}

export const DefinitionsObject = t.record(t.string, SchemaObject, 'DefinitionsObject');
