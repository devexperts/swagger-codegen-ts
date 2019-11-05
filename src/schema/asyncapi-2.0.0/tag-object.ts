import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject, ExternalDocumentationObjectCodec } from './external-documentation-object';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface TagObject {
	readonly name: string;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const TagObjectCodec: Codec<TagObject> = type(
	{
		name: string,
		description: optionFromNullable(string),
		externalDocs: optionFromNullable(ExternalDocumentationObjectCodec),
	},
	'TagObject',
);
