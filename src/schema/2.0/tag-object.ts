import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
import { stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { string, type } from 'io-ts';

export interface TagObject {
	readonly name: string;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const TagObject = type(
	{
		name: string,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
	},
	'TagObject',
);
