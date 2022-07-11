import { Codec } from '../../../utils/io-ts';
import { SharedStyle } from './shared-style';
export interface ForeignLayerStyle {
    readonly sourceLibraryName: string;
    readonly localSharedStyle: SharedStyle;
}
export declare const ForeignLayerStyleCodec: Codec<ForeignLayerStyle>;
