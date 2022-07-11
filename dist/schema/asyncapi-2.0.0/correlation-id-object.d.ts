import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
export interface CorrelationIdObject {
    readonly description: Option<string>;
    readonly location: string;
}
export declare const CorrelationIdObjectCodec: Codec<CorrelationIdObject>;
