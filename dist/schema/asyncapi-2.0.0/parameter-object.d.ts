import { Option } from 'fp-ts/lib/Option';
import { SchemaObject } from './schema-object';
import { Codec } from '../../utils/io-ts';
export interface ParameterObject {
    readonly description: Option<string>;
    readonly schema: Option<SchemaObject>;
    readonly location: Option<string>;
}
export declare const ParameterObjectCodec: Codec<ParameterObject>;
