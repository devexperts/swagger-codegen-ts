import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { CorrelationIdObject, CorrelationIdObjectCodec } from './correlation-id-object';
import { TagsObject, TagsObjectCodec } from './tags-object';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';
import { MessageTraitObject, MessageTraitObjectCodec } from './message-trait-object';
import { ObjectSchemaObject, ObjectSchemaObjectCodec, SchemaObject, SchemaObjectCodec } from './schema-object';
import { Codec } from '../../utils/io-ts';
import { array, record, string, type, union, unknown } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface MessageObject {
	readonly headers: Option<ObjectSchemaObject>;
	// inaccurate to the spec https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-messageobject-a-message-object
	readonly payload: ReferenceObject | SchemaObject;
	readonly correlationId: Option<ReferenceObject | CorrelationIdObject>;
	readonly schemaFormat: Option<string>;
	readonly contentType: Option<string>;
	readonly name: Option<string>;
	readonly title: Option<string>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly tags: Option<TagsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly examples: Option<Record<string, unknown>>;
	readonly traits: Option<MessageTraitObject[]>;
}

export const MessageObjectCodec: Codec<MessageObject> = type(
	{
		headers: optionFromNullable(ObjectSchemaObjectCodec),
		payload: union([ReferenceObjectCodec, SchemaObjectCodec]),
		correlationId: optionFromNullable(union([ReferenceObjectCodec, CorrelationIdObjectCodec])),
		schemaFormat: optionFromNullable(string),
		contentType: optionFromNullable(string),
		name: optionFromNullable(string),
		title: optionFromNullable(string),
		summary: optionFromNullable(string),
		description: optionFromNullable(string),
		tags: optionFromNullable(TagsObjectCodec),
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
		examples: optionFromNullable(record(string, unknown)),
		traits: optionFromNullable(array(MessageTraitObjectCodec)),
	},
	'MessageObject',
);
