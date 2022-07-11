import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface ServerVariableObject {
    readonly enum: Option<string[]>;
    readonly default: Option<string>;
    readonly description: Option<string>;
    readonly examples: Option<string[]>;
}
export declare const ServerVariableObjectCodec: Codec<ServerVariableObject>;
