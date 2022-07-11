import { AssetCollection } from '../../../../../schema/sketch-121/objects/asset-collection';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
export declare const serializeAssetCollection: import("fp-ts/lib/Reader").Reader<import("../../utils").Context, (assets: AssetCollection) => Either<Error, Option<string>>>;
