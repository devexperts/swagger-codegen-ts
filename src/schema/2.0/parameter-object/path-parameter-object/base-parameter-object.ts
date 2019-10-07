import { BaseParameterObjectProps } from '../base-parameter-object';
import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import { stringOption } from '../../../../utils/io-ts';

export interface BasePathParameterObjectProps extends BaseParameterObjectProps {
	readonly in: 'path';
	readonly required: true;
	readonly format: Option<string>;
}

export const BasePathParameterObjectProps = {
	...BaseParameterObjectProps,
	in: t.literal('path'),
	required: t.literal(true),
	format: stringOption,
};
