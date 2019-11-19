import { Codec } from '../../../utils/io-ts';
import { number, string, type } from 'io-ts';

export interface FontDescriptor {
	readonly attributes: {
		readonly name: string;
		readonly size: number;
	};
}

export const FontDescriptorCodec: Codec<FontDescriptor> = type({
	attributes: type({
		name: string,
		size: number,
	}),
});
