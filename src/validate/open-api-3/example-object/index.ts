import { string, type, unknown } from 'io-ts';
import { Option } from 'fp-ts/lib/Option';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#exampleObject
export type ExampleObject = {
	summary: Option<string>;
	description: Option<string>;
	value: Option<unknown>;
	externalValue: Option<string>;
};
export const exampleObjectIO = type(
	{
		summary: createOptionFromNullable(string),
		description: createOptionFromNullable(string),
		value: createOptionFromNullable(unknown),
		externalValue: createOptionFromNullable(string),
	},
	'ExampleObject',
);
