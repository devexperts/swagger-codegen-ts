import { ChannelItemObject } from './channel-item-object';
import { Codec } from '../../utils/io-ts';
export interface ChannelsObject extends Record<string, ChannelItemObject> {
}
export declare const ChannelsObjectCodec: Codec<ChannelsObject>;
