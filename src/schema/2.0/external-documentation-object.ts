import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { stringOption } from '../../utils/io-ts';

export interface ExternalDocumentationObject {
	readonly description: Option<string>;
	readonly url: string;
}

export const ExternalDocumentationObject = t.type(
	{
		description: stringOption,
		url: t.string,
	},
	'ExternalDocumentationObject',
);
