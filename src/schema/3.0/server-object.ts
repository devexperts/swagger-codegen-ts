import { ServerVariableObject, ServerVariableObjectCodec } from './server-variable-object';
import { intersection, partial, record, string, type } from 'io-ts';

export interface ServerObject {
	readonly url: string;
	readonly description?: string;
	readonly variables?: Record<string, ServerVariableObject>;
}

export const ServerObjectCodec = intersection(
	[
		type({
			url: string,
		}),
		partial({
			description: string,
			variables: record(string, ServerVariableObjectCodec),
		}),
	],
	'ServerObject',
);
