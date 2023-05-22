import { Codec } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { Fill } from './fill';
import { GraphicsContextSettings } from './graphics-context-settings';
import { Border } from './border';
import { BorderOptions } from './border-options';
import { InnerShadow } from './inner-shadow';
import { Shadow } from './shadow';
import { TextStyle } from './text-style';
import { ObjectID } from './object-id';
export interface Style {
    readonly do_objectID: ObjectID;
    readonly borders: Option<Border[]>;
    readonly borderOptions: BorderOptions;
    readonly fills: Option<Fill[]>;
    readonly textStyle: Option<TextStyle>;
    readonly shadows: Option<Shadow[]>;
    readonly innerShadows: InnerShadow[];
    readonly contextSettings: Option<GraphicsContextSettings>;
}
export declare const StyleCodec: Codec<Style>;
