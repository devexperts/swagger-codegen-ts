import { Option } from 'fp-ts/lib/Option';
import { BaseSchemaObject, SchemaObject, BaseSchemaObjectCodec, SchemaObjectCodec } from './schema-object';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { Codec, NonEmptySet, nonEmptySetFromArray } from '../../utils/io-ts';
import { intersection, literal, record, recursion, string, type, union } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ordString } from 'fp-ts/lib/Ord';

export interface WebsocketsChannelBindingSchemaObject extends BaseSchemaObject {
	readonly type: 'object';
	readonly properties: Record<string, ReferenceObject | SchemaObject>;
	readonly additionalProperties: Option<ReferenceObject | SchemaObject>;
	readonly required: Option<NonEmptySet<string>>;
}

const WebsocketsChannelBindingSchemaObjectCodec: Codec<WebsocketsChannelBindingSchemaObject> = recursion(
	'WebsocketsChannelBindingSchemaObject',
	() =>
		intersection([
			BaseSchemaObjectCodec,
			type({
				type: literal('object'),
				properties: record(string, union([ReferenceObjectCodec, SchemaObjectCodec])),
				additionalProperties: optionFromNullable(union([ReferenceObjectCodec, SchemaObjectCodec])),
				required: optionFromNullable(nonEmptySetFromArray(string, ordString)),
			}),
		]),
);

export interface WebsocketsChannelBindingObject {
	readonly method: Option<string>;
	readonly query: Option<WebsocketsChannelBindingSchemaObject>;
	readonly headers: Option<WebsocketsChannelBindingSchemaObject>;
	readonly bindingVersion: Option<string>;
}

export const WebsocketsChannelBindingObjectCodec: Codec<WebsocketsChannelBindingObject> = type(
	{
		method: optionFromNullable(string),
		query: optionFromNullable(WebsocketsChannelBindingSchemaObjectCodec),
		headers: optionFromNullable(WebsocketsChannelBindingSchemaObjectCodec),
		bindingVersion: optionFromNullable(string),
	},
	'WebsocketsChannelBindingObject',
);
