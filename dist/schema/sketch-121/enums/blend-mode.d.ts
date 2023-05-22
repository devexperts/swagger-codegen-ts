import { Codec } from '../../../utils/io-ts';
export declare type BlendMode = 'Normal' | 'Darken' | 'Multiply' | 'Color burn' | 'Lighten' | 'Screen' | 'Color dodge' | 'Overlay' | 'Soft light' | 'Hard light' | 'Difference' | 'Exclusion' | 'Hue' | 'Saturation' | 'Color' | 'Luminosity' | 'Plus darker' | 'Plus lighter';
export declare const BlendModeCodec: Codec<BlendMode>;
