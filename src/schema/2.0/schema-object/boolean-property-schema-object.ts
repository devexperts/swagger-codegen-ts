import { literal, type } from 'io-ts';

export interface BooleanPropertySchemaObject {
	readonly type: 'boolean';
}

export const BooleanPropertySchemaObject = type(
	{
		type: literal('boolean'),
	},
	'BooleanPropertySchemaObject',
);
