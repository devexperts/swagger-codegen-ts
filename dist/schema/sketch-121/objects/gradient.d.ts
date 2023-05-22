import { GradientType } from '../enums/gradient-type';
import { Codec } from '../../../utils/io-ts';
import { PointString } from '../utils/point-string';
import { GradientStop } from './gradient-stop';
export interface Gradient {
    readonly gradientType: GradientType;
    readonly from: PointString;
    readonly to: PointString;
    readonly stops: GradientStop[];
}
export declare const GradientCodec: Codec<Gradient>;
