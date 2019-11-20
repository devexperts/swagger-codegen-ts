import { Gradient, GradientCodec } from './gradient';
import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { UUID } from 'io-ts-types/lib/UUID';

export interface GradientAsset {
	readonly do_objectID: UUID;
	readonly name: string;
	readonly gradient: Gradient;
}

export const GradientAssetCodec: Codec<GradientAsset> = type({
	do_objectID: UUID,
	name: string,
	gradient: GradientCodec,
});
