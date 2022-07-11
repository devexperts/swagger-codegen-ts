import { Codec } from '../../../utils/io-ts';
export interface BorderOptions {
    readonly isEnabled: boolean;
    readonly dashPattern: number[];
}
export declare const BorderOptionsCodec: Codec<BorderOptions>;
