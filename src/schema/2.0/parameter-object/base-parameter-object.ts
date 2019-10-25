import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../../utils/io-ts';
import { string } from 'io-ts';

export interface BaseParameterObjectProps {
	readonly name: string;
	readonly description: Option<string>;
}

export const BaseParameterObjectProps = {
	name: string,
	description: stringOption,
};
