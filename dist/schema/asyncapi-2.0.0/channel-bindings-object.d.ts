import { Option } from 'fp-ts/lib/Option';
import { WebsocketsChannelBindingObject } from './websockets-channel-binding-object';
import { Codec } from '../../utils/io-ts';
export interface ChannelBindingsObject {
    readonly ws: Option<WebsocketsChannelBindingObject>;
}
export declare const ChannelBindingsObjectCodec: Codec<ChannelBindingsObject>;
