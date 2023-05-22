import { ForeignLayerStyle } from '../../../../../schema/sketch-121/objects/foreign-layer-style';
import { Either } from 'fp-ts/lib/Either';
export declare const serializeForeignLayerStyle: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (style: ForeignLayerStyle) => Either<Error, string>>;
