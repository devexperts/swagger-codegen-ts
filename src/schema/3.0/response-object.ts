import { record, string, type } from 'io-ts';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface ResponseObject {
	readonly description: string;
	readonly content: Option<Record<string, MediaTypeObject>>;
}

export const ResponseObjectCodec: Codec<ResponseObject> = type(
	{
		description: string,
		content: optionFromNullable(record(string, MediaTypeObjectCodec)),
	},
	'ResponseObject',
);
