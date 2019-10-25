import { booleanOption, stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { literal, string, type } from 'io-ts';

export interface FormDataParameterObject {
	readonly name: string;
	readonly in: 'formData';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const FormDataParameterObject = type(
	{
		name: string,
		in: literal('formData'),
		description: stringOption,
		required: booleanOption,
	},
	'FormDataParameterObject',
);
