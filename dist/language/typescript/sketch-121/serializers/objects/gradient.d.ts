import { Gradient } from '../../../../../schema/sketch-121/objects/gradient';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeGradient: (gradient: Gradient) => Either<Error, string>;
