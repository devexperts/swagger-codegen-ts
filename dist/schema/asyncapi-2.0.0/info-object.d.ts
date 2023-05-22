import { Option } from 'fp-ts/lib/Option';
import { ContactObject } from './contact-object';
import { LicenseObject } from './license-object';
import { Codec } from '../../utils/io-ts';
export interface InfoObject {
    readonly title: string;
    readonly version: string;
    readonly description: Option<string>;
    readonly termsOfService: Option<string>;
    readonly contact: Option<ContactObject>;
    readonly license: Option<LicenseObject>;
}
export declare const InfoObjectCodec: Codec<InfoObject>;
