import { stringOption } from '../../../utils/io-ts';
import { Option } from 'fp-ts/lib/Option';

export interface BaseSecuritySchemeObjectProps {
	readonly description: Option<string>;
}

export const BaseSecuritySchemeObjectProps = {
	description: stringOption,
};
