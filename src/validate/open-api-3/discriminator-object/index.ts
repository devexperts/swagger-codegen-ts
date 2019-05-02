import { Option } from 'fp-ts/lib/Option';
import { record, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#discriminatorObject
export type DiscriminatorObject = {
	propertyName: string;
	mapping: Option<Record<string, string>>;
};
export const discriminatorObjectIO = type(
	{
		propertyName: string,
		mapping: createOptionFromNullable(record(string, string)),
	},
	'DiscriminatorObject',
);
