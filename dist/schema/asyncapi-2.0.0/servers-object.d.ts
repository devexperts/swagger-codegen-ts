import { Branded } from 'io-ts';
import { ServerObject } from './server-object';
import { Codec } from '../../utils/io-ts';
export interface ServersObjectFieldPatternBrand {
    readonly ServersObjectFieldPattern: unique symbol;
}
export declare type ServersObjectPattern = Branded<string, ServersObjectFieldPatternBrand>;
export interface ServersObject extends Record<ServersObjectPattern, ServerObject> {
}
export declare const ServersObjectCodec: Codec<ServersObject>;
