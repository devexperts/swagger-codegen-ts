import { ItemsObject } from './items-object';
import { Option } from 'fp-ts/lib/Option';
export declare type HeaderObject = ItemsObject & {
    readonly description: Option<string>;
};
export declare const HeaderObject: import("io-ts").IntersectionC<[import("../../utils/io-ts").Codec<ItemsObject>, import("io-ts").TypeC<{
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>]>;
