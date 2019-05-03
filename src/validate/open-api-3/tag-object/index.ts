import { Option } from 'fp-ts/lib/Option';
import { ExternalDocumentationObject, externalDocumentationObjectIO } from '../external-documentation-object';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#tagObject
export type TagObject = {
	name: string;
	description: Option<string>;
	externalDocs: Option<ExternalDocumentationObject>;
};
export const tagObjectIO = type(
	{
		name: string,
		description: createOptionFromNullable(string),
		externalDocs: createOptionFromNullable(externalDocumentationObjectIO),
	},
	'TagObject',
);
