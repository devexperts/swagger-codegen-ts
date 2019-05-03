import { Option } from 'fp-ts/lib/Option';
import { array, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#serverVariableObject
export type ServerVariableObject = {
	enum: Option<string[]>;
	default: string;
	description: Option<string>;
};
export const serverVariableObjectIO = type(
	{
		enum: createOptionFromNullable(array(string)),
		default: string,
		description: createOptionFromNullable(string),
	},
	'ServerVariableObject',
);
