import { PathItemObject } from './path-item-object';
import { Codec } from '../../utils/io-ts';
export interface PathsObject extends Record<string, PathItemObject> {
}
export declare const PathsObjectCodec: Codec<PathsObject>;
