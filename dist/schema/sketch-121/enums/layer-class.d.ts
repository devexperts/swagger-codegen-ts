import { Codec } from '../../../utils/io-ts';
export declare type LayerClass = 'symbolInstance' | 'symbolMaster' | 'group' | 'oval' | 'text' | 'rectangle' | 'shapePath' | 'shapeGroup' | 'artboard';
export declare const LayerClassCodec: Codec<LayerClass>;
