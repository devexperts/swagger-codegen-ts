import { boolean, record, string, type } from 'io-ts';
import { MediaTypeObject, MediaTypeObjectCodec } from './media-type-object';
import { Option } from 'fp-ts/lib/Option';
import { Codec } from '../../utils/io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';

export interface RequestBodyObject {
	readonly description: Option<string>;
	readonly content: Record<string, MediaTypeObject>;
	readonly required: Option<boolean>;
}

export const RequestBodyObjectCodec: Codec<RequestBodyObject> = type(
	{
		content: record(string, MediaTypeObjectCodec),
		description: optionFromNullable(string),
		required: optionFromNullable(boolean),
	},
	'RequestBodyObject',
);
