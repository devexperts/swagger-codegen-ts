import { Option } from 'fp-ts/lib/Option';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#externalDocumentationObject
export type ExternalDocumentationObject = {
	description: Option<string>;
	url: string;
};
export const externalDocumentationObjectIO = type(
	{
		description: createOptionFromNullable(string),
		url: string,
	},
	'ExternalDocumentationObject',
);
