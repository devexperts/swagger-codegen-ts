import { Codec } from '../../../utils/io-ts';
export interface FontDescriptor {
    readonly attributes: {
        readonly name: string;
        readonly size: number;
    };
}
export declare const FontDescriptorCodec: Codec<FontDescriptor>;
