import { Page } from '../../../../../schema/sketch-121/objects/page';
import { either } from 'fp-ts';
export declare const serializePage: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (page: Page) => either.Either<Error, string>>;
