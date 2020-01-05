import { Gradient, GradientCodec } from './gradient';
import { Codec } from '../../../utils/io-ts';
import { string, type } from 'io-ts';
import { ObjectID, ObjectIDCodec } from './object-id';

export interface GradientAsset {
	readonly do_objectID: ObjectID;
	readonly name: string;
	readonly gradient: Gradient;
}

export const GradientAssetCodec: Codec<GradientAsset> = type({
	do_objectID: ObjectIDCodec,
	name: string,
	gradient: GradientCodec,
});
