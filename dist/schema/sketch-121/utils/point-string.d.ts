import { Codec } from '../../../utils/io-ts';
export interface PointString {
    readonly x: number;
    readonly y: number;
}
export declare const PointStringCodec: Codec<PointString>;
