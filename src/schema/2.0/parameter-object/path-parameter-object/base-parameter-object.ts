import { BaseParameterObjectProps } from '../base-parameter-object';
import { Option } from 'fp-ts/lib/Option';
import { stringOption } from '../../../../utils/io-ts';
import { literal } from 'io-ts';

export interface BasePathParameterObjectProps extends BaseParameterObjectProps {
	readonly in: 'path';
	readonly required: true;
	readonly format: Option<string>;
}

export const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: literal('path'),
	required: literal(true),
	format: stringOption,
};
