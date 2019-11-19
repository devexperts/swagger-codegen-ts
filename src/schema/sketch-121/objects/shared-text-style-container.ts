import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { SharedStyle, SharedStyleCodec } from './shared-style';

export interface SharedTextStyleContainer {
	readonly objects: SharedStyle[];
}

export const SharedTextStyleContainerCodec: Codec<SharedTextStyleContainer> = type(
	{
		objects: array(SharedStyleCodec),
	},
	'SharedTextStyleContainer',
);
