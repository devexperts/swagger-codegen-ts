import { Option } from 'fp-ts/lib/Option';
import { ServerVariableObject } from './server-variable-object';
import { SecurityRequirementObject } from './security-requirement-object';
import { Codec } from '../../utils/io-ts';
export interface ServerObject {
    readonly url: string;
    readonly protocol: string;
    readonly protocolVersion: Option<string>;
    readonly description: Option<string>;
    readonly variables: Option<Record<string, ServerVariableObject>>;
    readonly security: Option<SecurityRequirementObject[]>;
}
export declare const ServerObjectCodec: Codec<ServerObject>;
