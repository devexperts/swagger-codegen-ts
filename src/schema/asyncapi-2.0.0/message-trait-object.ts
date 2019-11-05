import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { CorrelationIdObject, CorrelationIdObjectCodec } from './correlation-id-object';
import { TagsObject, TagsObjectCodec } from './tags-object';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { record, string, type, union, unknown } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { ObjectSchemaObject, ObjectSchemaObjectCodec } from './schema-object';

export interface MessageTraitObject {
	readonly headers: Option<ReferenceObject | ObjectSchemaObject>;
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
}

export const MessageTraitObjectCodec: Codec<MessageTraitObject> = type(
	{
		headers: optionFromNullable(union([ReferenceObjectCodec, ObjectSchemaObjectCodec])),
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
	},
	'MessageTraitObject',
);
