import { HeaderObject, headerObjectIO } from '../header-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { MediaTypeObject, mediaTypeObjectIO } from '../media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { LinkObject, linkObjectIO } from '../link-object';
import { record, string, type, union } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responseObject
export type ResponseObject = {
	description: string;
	headers: Option<Record<string, HeaderObject | ReferenceObject>>;
	content: Option<Record<string, MediaTypeObject>>;
	links: Option<Record<string, LinkObject | ReferenceObject>>;
};
export const responseObjectIO = type(
	{
		description: string,
		headers: createOptionFromNullable(record(string, union([headerObjectIO, referenceObjectIO]))),
		content: createOptionFromNullable(record(string, mediaTypeObjectIO)),
		links: createOptionFromNullable(record(string, union([linkObjectIO, referenceObjectIO]))),
	},
	'ResponseObject',
);
