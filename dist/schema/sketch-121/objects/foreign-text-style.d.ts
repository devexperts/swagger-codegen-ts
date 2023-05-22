import { Codec } from '../../../utils/io-ts';
import { SharedStyle } from './shared-style';
export interface ForeignTextStyle {
    readonly sourceLibraryName: string;
    readonly localSharedStyle: SharedStyle;
}
export declare const ForeignTextStyleCodec: Codec<ForeignTextStyle>;
