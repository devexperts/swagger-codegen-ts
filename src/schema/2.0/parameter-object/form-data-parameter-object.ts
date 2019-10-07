import * as t from 'io-ts';
import { booleanOption, stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';

export interface FormDataParameterObject {
	readonly name: string;
	readonly in: 'formData';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const FormDataParameterObject = t.type(
	{
		name: t.string,
		in: t.literal('formData'),
		description: stringOption,
		required: booleanOption,
	},
	'FormDataParameterObject',
);
