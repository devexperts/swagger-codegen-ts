import { MediaTypeObject } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface ResponseObject {
    readonly description: string;
    readonly content: Option<Record<string, MediaTypeObject>>;
}
export declare const ResponseObjectCodec: Codec<ResponseObject>;
