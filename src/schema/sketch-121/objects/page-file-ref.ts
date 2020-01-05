import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';

export interface PageFileRef {
	readonly _ref: string;
}

export const PageFileRefCodec: Codec<PageFileRef> = type({
	_ref: string,
});
