import { ChannelItemObject, ChannelItemObjectCodec } from './channel-item-object';
import { Codec } from '../../utils/io-ts';
import { record, string } from 'io-ts';

export interface ChannelsObject extends Record<string, ChannelItemObject> {}

export const ChannelsObjectCodec: Codec<ChannelsObject> = record(string, ChannelItemObjectCodec, 'ChannelsObject');
