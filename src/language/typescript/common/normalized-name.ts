import { Endomorphism } from 'fp-ts/lib/function';
import { Branded } from 'io-ts';
import { Ref } from '../../../utils/ref';

export interface NormalizedNameBrand {
	readonly NormalizedName: unique symbol;
}

export type NormalizedName = Branded<string, NormalizedNameBrand>;

const INVALID_NAMES = ['Error', 'Promise', 'PromiseLike', 'Array', 'ArrayLike', 'Function', 'Object'];

export const makeNormalizedName = (name: string): NormalizedName => {
	return (INVALID_NAMES.includes(name) ? `${name}Type` : name) as NormalizedName;
};

export const normalizeRefNameAndPath: Endomorphism<Ref> = ref => {
	const normalizedName = makeNormalizedName(ref.name);
	if (normalizedName !== ref.name) {
		return { ...ref, name: normalizedName, path: ref.path.replace(ref.name, normalizedName) };
	}
	return ref;
};
