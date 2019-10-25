import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../utils/io-ts';
import { string, type } from 'io-ts';

export interface ExternalDocumentationObject {
	readonly description: Option<string>;
	readonly url: string;
}

export const ExternalDocumentationObject = type(
	{
		description: stringOption,
		url: string,
	},
	'ExternalDocumentationObject',
);
