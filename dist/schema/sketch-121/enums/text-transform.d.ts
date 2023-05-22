import { Codec } from '../../../utils/io-ts';
export declare type TextTransform = 'None' | 'Uppercase' | 'Lowercase';
export declare const TextTransformCodec: Codec<TextTransform>;
