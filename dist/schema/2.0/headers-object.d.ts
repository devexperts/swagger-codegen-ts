import { Dictionary } from '../../utils/types';
import { HeaderObject } from './header-object';
export interface HeadersObject extends Dictionary<HeaderObject> {
}
export declare const HeadersObject: import("io-ts").RecordC<import("io-ts").StringC, import("io-ts").IntersectionC<[import("../../utils/io-ts").Codec<import("./items-object").ItemsObject>, import("io-ts").TypeC<{
    description: import("io-ts-types/lib/optionFromNullable").OptionFromNullableC<import("io-ts").StringC>;
}>]>>;
