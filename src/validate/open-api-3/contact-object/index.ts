import { Option } from 'fp-ts/lib/Option';
import { string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#contactObject
export type ContactObject = {
	name: Option<string>;
	url: Option<string>;
	email: Option<string>;
};
export const contactObjectIO = type(
	{
		name: createOptionFromNullable(string),
		url: createOptionFromNullable(string),
		email: createOptionFromNullable(string),
	},
	'ContactObject',
);
