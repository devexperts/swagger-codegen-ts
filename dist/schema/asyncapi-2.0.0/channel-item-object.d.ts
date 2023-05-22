import { Option } from 'fp-ts/lib/Option';
import { OperationObject } from './operation-object';
import { ParametersObject } from './parameters-object';
import { Codec } from '../../utils/io-ts';
import { ChannelBindingsObject } from './channel-bindings-object';
export interface ChannelItemObject {
    readonly $ref: Option<string>;
    readonly description: Option<string>;
    readonly subscribe: Option<OperationObject>;
    readonly publish: Option<OperationObject>;
    readonly parameters: Option<ParametersObject>;
    readonly bindings: Option<ChannelBindingsObject>;
}
export declare const ChannelItemObjectCodec: Codec<ChannelItemObject>;
