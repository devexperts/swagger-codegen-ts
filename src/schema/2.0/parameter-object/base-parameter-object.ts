import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { stringOption } from '../../../utils/io-ts';

export interface BaseParameterObjectProps {
	readonly name: string;
	readonly description: Option<string>;
}

export const BaseParameterObjectProps = {
	name: t.string,
	description: stringOption,
};
