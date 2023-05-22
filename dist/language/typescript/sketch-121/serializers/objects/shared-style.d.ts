import { SharedStyle } from '../../../../../schema/sketch-121/objects/shared-style';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeSharedStyle: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (sharedStyle: SharedStyle, jsdoc?: string[] | undefined) => Either<Error, string>>;
