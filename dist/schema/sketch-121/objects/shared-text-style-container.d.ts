import { Codec } from '../../../utils/io-ts';
import { SharedStyle } from './shared-style';
export interface SharedTextStyleContainer {
    readonly objects: SharedStyle[];
}
export declare const SharedTextStyleContainerCodec: Codec<SharedTextStyleContainer>;
