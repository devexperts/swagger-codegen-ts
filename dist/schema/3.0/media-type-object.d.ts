import { SchemaObject } from './schema-object';
import { ReferenceObject } from './reference-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface MediaTypeObject {
    readonly schema: Option<SchemaObject | ReferenceObject>;
}
export declare const MediaTypeObjectCodec: Codec<MediaTypeObject>;
