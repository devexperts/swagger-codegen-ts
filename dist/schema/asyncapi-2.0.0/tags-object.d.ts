import { TagObject } from './tag-object';
import { Codec } from '../../utils/io-ts';
export interface TagsObject extends Array<TagObject> {
}
export declare const TagsObjectCodec: Codec<TagsObject>;
