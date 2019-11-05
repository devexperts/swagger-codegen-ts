import { Option } from 'fp-ts/lib/Option';
import { InfoObject, InfoObjectCodec } from './info-object';
import { ServersObject, ServersObjectCodec } from './servers-object';
import { Codec } from '../../utils/io-ts';
import { literal, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ChannelsObject, ChannelsObjectCodec } from './channels-object';
import { ComponentsObject, ComponentsObjectCodec } from './components-object';
import { TagsObject, TagsObjectCodec } from './tags-object';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';

export interface AsyncAPIObject {
	readonly asyncapi: '2.0.0';
	readonly info: InfoObject;
	readonly servers: Option<ServersObject>;
	readonly channels: ChannelsObject;
	readonly components: Option<ComponentsObject>;
	readonly tags: Option<TagsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const AsyncAPIObjectCodec: Codec<AsyncAPIObject> = type(
	{
		asyncapi: literal('2.0.0'),
		info: InfoObjectCodec,
		servers: optionFromNullable(ServersObjectCodec),
		channels: ChannelsObjectCodec,
		components: optionFromNullable(ComponentsObjectCodec),
		tags: optionFromNullable(TagsObjectCodec),
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
	},
	'AsyncAPIObject',
);
