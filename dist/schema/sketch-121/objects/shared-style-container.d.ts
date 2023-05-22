import { Codec } from '../../../utils/io-ts';
import { SharedStyle } from './shared-style';
export interface SharedStyleContainer {
    readonly objects: SharedStyle[];
}
export declare const SharedStyleContainerCodec: Codec<SharedStyleContainer>;
