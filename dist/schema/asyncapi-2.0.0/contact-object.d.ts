import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface ContactObject {
    readonly name: Option<string>;
    readonly url: Option<string>;
    readonly email: Option<string>;
}
export declare const ContactObjectCodec: Codec<ContactObject>;
