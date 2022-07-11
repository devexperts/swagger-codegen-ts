import { SharedStyleContainer } from '../../../../../schema/sketch-121/objects/shared-style-container';
import { Either } from 'fp-ts/lib/Either';
import { option } from 'fp-ts';
export declare const serializeSharedStyleContainer: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (sharedStyleContainer: SharedStyleContainer) => Either<Error, option.Option<string>>>;
