import { Codec } from '../../../utils/io-ts';
export interface OverrideValue {
    readonly _class: string;
    readonly overrideName: string;
    readonly value: string;
}
export declare const OverrideValueCodec: Codec<OverrideValue>;
