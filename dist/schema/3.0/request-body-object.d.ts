import { MediaTypeObject } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface RequestBodyObject {
    readonly description: Option<string>;
    readonly content: Record<string, MediaTypeObject>;
    readonly required: Option<boolean>;
}
export declare const RequestBodyObjectCodec: Codec<RequestBodyObject>;
