import { TextHorizontalAlignment } from '../../../../../schema/sketch-121/enums/text-horizontal-alignment';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeTextHorizontalAlignment: (alignment: TextHorizontalAlignment) => Either<Error, string>;
