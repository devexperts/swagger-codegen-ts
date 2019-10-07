import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject } from './external-documentation-object';
import * as t from 'io-ts';
import { stringOption } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface TagObject {
	readonly name: string;
	readonly description: Option<string>;
	readonly externalDocs: Option<ExternalDocumentationObject>;
}

export const TagObject = t.type(
	{
		name: t.string,
		description: stringOption,
		externalDocs: optionFromNullable(ExternalDocumentationObject),
	},
	'TagObject',
);
