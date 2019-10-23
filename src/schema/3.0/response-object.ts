import { intersection, partial, record, string, Type, type } from 'io-ts';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';

export interface ResponseObject {
	readonly description: string;
	readonly content?: Record<string, MediaTypeObject>;
}

export const ResponseObjectCodec: Type<ResponseObject> = intersection(
	[
		type({
			description: string,
		}),
		partial({
			content: record(string, MediaTypeObjectCodec),
		}),
	],
	'ResponseObject',
);
