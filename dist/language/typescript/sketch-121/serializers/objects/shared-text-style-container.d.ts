import { Either } from 'fp-ts/lib/Either';
import { option } from 'fp-ts';
import { SharedTextStyleContainer } from '../../../../../schema/sketch-121/objects/shared-text-style-container';
export declare const serializeSharedTextStyleContainer: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (sharedTextStyleContainer: SharedTextStyleContainer) => Either<Error, option.Option<string>>>;
