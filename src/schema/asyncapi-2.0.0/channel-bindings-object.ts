import { Option } from 'fp-ts/lib/Option';
import {
	WebsocketsChannelBindingObject,
	WebsocketsChannelBindingObjectCodec,
} from './websockets-channel-binding-object';
import { Codec } from '../../utils/io-ts';
import { type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ChannelBindingsObject {
	readonly ws: Option<WebsocketsChannelBindingObject>;
}

export const ChannelBindingsObjectCodec: Codec<ChannelBindingsObject> = type(
	{
		ws: optionFromNullable(WebsocketsChannelBindingObjectCodec),
	},
	'ChannelBindingsObject',
);
