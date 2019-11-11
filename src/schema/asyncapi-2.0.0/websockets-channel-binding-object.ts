import { Option } from 'fp-ts/lib/Option';
import { ObjectSchemaObject, ObjectSchemaObjectCodec } from './schema-object';
import { Codec } from '../../utils/io-ts';
import { literal, string, type, union } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface WebsocketsChannelBindingObject {
	readonly method: Option<'GET' | 'POST'>;
	readonly query: Option<ObjectSchemaObject>;
	readonly headers: Option<ObjectSchemaObject>;
	readonly bindingVersion: Option<string>;
}

export const WebsocketsChannelBindingObjectCodec: Codec<WebsocketsChannelBindingObject> = type(
	{
		method: optionFromNullable(union([literal('GET'), literal('POST')])),
		query: optionFromNullable(ObjectSchemaObjectCodec),
		headers: optionFromNullable(ObjectSchemaObjectCodec),
		bindingVersion: optionFromNullable(string),
	},
	'WebsocketsChannelBindingObject',
);
