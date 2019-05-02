import { boolean, record, recursion, string, type, union } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { HeaderObject, headerObjectIO } from '../header-object';
import { ReferenceObject, referenceObjectIO } from '../reference-object';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#encodingObject
export type EncodingObject = {
	contentType: Option<string>;
	headers: Option<Record<string, HeaderObject | ReferenceObject>>;
	style: Option<string>;
	explode: Option<boolean>;
	allowReserved: Option<boolean>;
};

export const encodingObjectIO = recursion<EncodingObject, unknown>('EncodingObject', () =>
	type({
		contentType: createOptionFromNullable(string),
		headers: createOptionFromNullable(record(string, union([headerObjectIO, referenceObjectIO]))),
		style: createOptionFromNullable(string),
		explode: createOptionFromNullable(boolean),
		allowReserved: createOptionFromNullable(boolean),
	}),
);
