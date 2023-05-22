import { GradientStop } from '../../../../../schema/sketch-121/objects/gradient-stop';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeGradientStop: (stop: GradientStop) => Either<Error, string>;
