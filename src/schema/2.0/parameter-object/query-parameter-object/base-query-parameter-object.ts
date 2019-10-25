import { booleanOption, stringOption } from '../../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';
import { literal, string } from 'io-ts';

export interface BaseQueryParameterObjectProps {
	readonly name: string;
	readonly in: 'query';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const BaseQueryParameterObjectProps = {
	name: string,
	in: literal('query'),
	description: stringOption,
	required: booleanOption,
};
