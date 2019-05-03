import { Option } from 'fp-ts/lib/Option';
import { ServerVariableObject, serverVariableObjectIO } from '../server-variable-object';
import { record, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#serverObject
export type ServerObject = {
	url: string;
	description: Option<string>;
	variables: Option<Record<string, ServerVariableObject>>;
};
export const serverObjectIO = type(
	{
		url: string,
		description: createOptionFromNullable(string),
		variables: createOptionFromNullable(record(string, serverVariableObjectIO)),
	},
	'ServerObject',
);
