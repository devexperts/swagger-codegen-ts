import { Option } from 'fp-ts/lib/Option';
import { TagsObject, TagsObjectCodec } from './tags-object';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { array, string, type, union } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { OperationTraitObject, OperationTraitObjectCodec } from './operation-trait-object';
import { MessageObject, MessageObjectCodec } from './message-object';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { ReferenceObject, ReferenceObjectCodec } from './reference-object';
import { nonEmptyArray } from 'io-ts-types/lib/nonEmptyArray';

export interface OperationObjectOneOfMessage {
	readonly oneOf: NonEmptyArray<ReferenceObject | MessageObject>;
}
export const OperationObjectOneOfMessageCodec: Codec<OperationObjectOneOfMessage> = type(
	{
		oneOf: nonEmptyArray(union([ReferenceObjectCodec, MessageObjectCodec])),
	},
	'OperationObjectOneOfMessage',
);

export interface OperationObject {
	readonly operationId: Option<string>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly tags: Option<TagsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
	readonly traits: Option<OperationTraitObject[]>;
	// inaccurate to https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-operationobject-a-operation-object
	readonly message: ReferenceObject | MessageObject | OperationObjectOneOfMessage;
}

export const OperationObjectCodec: Codec<OperationObject> = type(
	{
		operationId: optionFromNullable(string),
		summary: optionFromNullable(string),
		description: optionFromNullable(string),
		tags: optionFromNullable(TagsObjectCodec),
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
		traits: optionFromNullable(array(OperationTraitObjectCodec)),
		message: union([ReferenceObjectCodec, MessageObjectCodec, OperationObjectOneOfMessageCodec]),
	},
	'OperationTraitObject',
);
