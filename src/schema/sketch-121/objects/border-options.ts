import { Codec } from '../../../utils/io-ts';
import { array, boolean, number, type } from 'io-ts';

export interface BorderOptions {
	readonly isEnabled: boolean;
	readonly dashPattern: number[];
}

export const BorderOptionsCodec: Codec<BorderOptions> = type({
	isEnabled: boolean,
	dashPattern: array(number),
});
