import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { string, type } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ExternalDocumentationObject {
	readonly description: Option<string>;
	readonly url: string;
}

export const ExternalDocumentationObjectCodec: Codec<ExternalDocumentationObject> = type(
	{
		description: optionFromNullable(string),
		url: string,
	},
	'ExternalDocumentationObject',
);
