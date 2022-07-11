import { ServerVariableObject } from './server-variable-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface ServerObject {
    readonly url: string;
    readonly description: Option<string>;
    readonly variables: Option<Record<string, ServerVariableObject>>;
}
export declare const ServerObjectCodec: Codec<ServerObject>;
