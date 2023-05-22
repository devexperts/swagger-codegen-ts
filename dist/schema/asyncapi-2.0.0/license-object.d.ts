import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface LicenseObject {
    readonly name: string;
    readonly url: Option<string>;
}
export declare const LicenseObjectCodec: Codec<LicenseObject>;
