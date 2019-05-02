import { Option } from 'fp-ts/lib/Option';
import { boolean, string, type } from 'io-ts';
import { createOptionFromNullable } from 'io-ts-types';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#xmlObject
export type XMLObject = {
	name: Option<string>;
	namespace: Option<string>;
	prefix: Option<string>;
	attribute: Option<boolean>;
	wrapper: Option<boolean>;
};
export const xmlObjectIO = type({
	name: createOptionFromNullable(string),
	namespace: createOptionFromNullable(string),
	prefix: createOptionFromNullable(string),
	attribute: createOptionFromNullable(boolean),
	wrapper: createOptionFromNullable(boolean),
});
