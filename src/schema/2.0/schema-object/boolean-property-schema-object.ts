import * as t from 'io-ts';

export interface BooleanPropertySchemaObject {
	readonly type: 'boolean';
}

export const BooleanPropertySchemaObject = t.type(
	{
		type: t.literal('boolean'),
	},
	'BooleanPropertySchemaObject',
);
