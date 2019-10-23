import { boolean, intersection, partial, record, string, type, Type } from 'io-ts';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';

export interface RequestBodyObject {
	readonly description?: string;
	readonly content: Record<string, MediaTypeObject>;
	readonly required?: boolean;
}

export const RequestBodyObjectCodec: Type<RequestBodyObject> = intersection(
	[
		type({
			content: record(string, MediaTypeObjectCodec),
		}),
		partial({
			description: string,
			required: boolean,
		}),
	],
	'RequestBodyObject',
);
