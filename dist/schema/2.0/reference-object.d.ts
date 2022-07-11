import { Codec } from '../../utils/io-ts';
export interface ReferenceObject {
    readonly $ref: string;
}
export declare const ReferenceObjectCodec: Codec<ReferenceObject>;
