import { Style } from '../../../../../schema/sketch-121/objects/style';
import { either } from 'fp-ts';
export declare const serializeStyle: (style: Style) => either.Either<Error, string>;
