import { Option } from 'fp-ts/lib/Option';
import { TagsObject, TagsObjectCodec } from './tags-object';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface OperationTraitObject {
	readonly operationId: Option<string>;
	readonly summary: Option<string>;
	readonly description: Option<string>;
	readonly tags: Option<TagsObject>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const OperationTraitObjectCodec: Codec<OperationTraitObject> = type(
	{
		operationId: optionFromNullable(string),
		summary: optionFromNullable(string),
		description: optionFromNullable(string),
		tags: optionFromNullable(TagsObjectCodec),
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
	},
	'OperationTraitObject',
);
