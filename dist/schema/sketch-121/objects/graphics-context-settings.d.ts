import { BlendMode } from '../enums/blend-mode';
import { Codec } from '../../../utils/io-ts';
export interface GraphicsContextSettings {
    readonly blendMode: BlendMode;
    readonly opacity: number;
}
export declare const GraphicsContextSettingsCodec: Codec<GraphicsContextSettings>;
