import { Codec } from '../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
export interface ServerVariableObject {
    readonly enum: Option<string[]>;
    readonly default: string;
    readonly description: Option<string>;
}
export declare const ServerVariableObjectCodec: Codec<ServerVariableObject>;
