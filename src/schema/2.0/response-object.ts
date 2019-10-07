import * as t from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { Option } from 'fp-ts/lib/Option';
import { ExampleObject } from './example-object';
import { HeadersObject } from './headers-object';
import { SchemaObject } from './schema-object/schema-object';

export interface ResponseObject {
	readonly description: string;
	readonly schema: Option<SchemaObject>;
	readonly headers: Option<HeadersObject>;
	readonly examples: Option<ExampleObject>;
}

export const ResponseObject = t.type(
	{
		description: t.string,
		schema: optionFromNullable(SchemaObject),
		headers: optionFromNullable(HeadersObject),
		examples: optionFromNullable(ExampleObject),
	},
	'ResponseObject',
);
