import { Either } from 'fp-ts/lib/Either';
import { ForeignTextStyle } from '../../../../../schema/sketch-121/objects/foreign-text-style';
export declare const serializeForeignTextStyle: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (style: ForeignTextStyle) => Either<Error, string>>;
