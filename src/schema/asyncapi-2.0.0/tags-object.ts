import { TagObject, TagObjectCodec } from './tag-object';
import { Codec } from '../../utils/io-ts';
import { array } from 'io-ts';

export interface TagsObject extends Array<TagObject> {}

export const TagsObjectCodec: Codec<TagsObject> = array(TagObjectCodec, 'TagsObject');
