import { Option } from 'fp-ts/lib/Option';
import { MediaTypeObject, mediaTypeObjectIO } from '../media-type-object';
import { boolean, record, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject
export type RequestBodyObject = {
	description: Option<string>;
	content: Record<string, MediaTypeObject>;
	required: Option<boolean>;
};
export const requestBodyObjectIO = type(
	{
		description: createOptionFromNullable(string),
		content: record(string, mediaTypeObjectIO),
		required: createOptionFromNullable(boolean),
	},
	'RequestBodyObject',
);
