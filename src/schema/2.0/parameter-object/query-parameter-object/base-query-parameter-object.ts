import * as t from 'io-ts';
import { booleanOption, stringOption } from '../../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';

export interface BaseQueryParameterObjectProps {
	readonly name: string;
	readonly in: 'query';
	readonly description: Option<string>;
	readonly required: Option<boolean>;
}

export const BaseQueryParameterObjectProps = {
	name: t.string,
	in: t.literal('query'),
	description: stringOption,
	required: booleanOption,
};
