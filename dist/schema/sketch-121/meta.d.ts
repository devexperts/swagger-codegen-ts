import { Codec } from '../../utils/io-ts';
export interface Meta {
    readonly version: 121 | 122 | 123;
}
export declare const MetaCodec: Codec<Meta>;
