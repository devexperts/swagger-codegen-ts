import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Option } from 'fp-ts/lib/Option';
import { ExampleObject } from './example-object';
import { HeadersObject } from './headers-object';
import { SchemaObject } from './schema-object/schema-object';
import { string, type } from 'io-ts';

export interface ResponseObject {
	readonly description: string;
	readonly schema: Option<SchemaObject>;
	readonly headers: Option<HeadersObject>;
	readonly examples: Option<ExampleObject>;
}

export const ResponseObject = type(
	{
		description: string,
		schema: optionFromNullable(SchemaObject),
		headers: optionFromNullable(HeadersObject),
		examples: optionFromNullable(ExampleObject),
	},
	'ResponseObject',
);
