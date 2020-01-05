import { Codec } from '../../../utils/io-ts';
import { array, type } from 'io-ts';
import { SharedStyle, SharedStyleCodec } from './shared-style';

export interface SharedStyleContainer {
	readonly objects: SharedStyle[];
}

export const SharedStyleContainerCodec: Codec<SharedStyleContainer> = type(
	{
		objects: array(SharedStyleCodec),
	},
	'SharedStyleContainer',
);
