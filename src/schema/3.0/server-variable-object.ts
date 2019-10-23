import { array, intersection, partial, string, type } from 'io-ts';

export interface ServerVariableObject {
	readonly enum?: string[];
	readonly default: string;
	readonly description?: string;
}

export const ServerVariableObjectCodec = intersection(
	[
		type({
			default: string,
		}),
		partial({
			enum: array(string),
			description: string,
		}),
	],
	'ServerVariableObject',
);
