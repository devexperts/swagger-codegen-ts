import { Layer } from '../../../../../schema/sketch-121/objects/layer';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeLayer: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (layer: Layer, jsdoc?: string[] | undefined) => Either<Error, string>>;
