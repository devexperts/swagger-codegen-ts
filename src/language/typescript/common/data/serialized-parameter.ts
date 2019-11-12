import { SerializedType } from './serialized-type';
import { monoidDependencies, SerializedDependency, uniqSerializedDependencies } from './serialized-dependency';
import { getStructMonoid, Monoid, monoidAny, monoidString } from 'fp-ts/lib/Monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array, getMonoid } from 'fp-ts/lib/Array';
import { Ref, uniqRefs } from '../../../../utils/ref';

export interface SerializedParameter extends SerializedType {
	readonly isRequired: boolean;
}

export const serializedParameter = (
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: SerializedDependency[],
	refs: Ref[],
): SerializedParameter => ({
	type,
	io,
	isRequired,
	dependencies: uniqSerializedDependencies(dependencies),
	refs: uniqRefs(refs),
});

export const fromSerializedType = (isRequired: boolean) => (serializedType: SerializedType): SerializedParameter => ({
	...serializedType,
	isRequired,
});

export const monoidSerializedParameter: Monoid<SerializedParameter> = getStructMonoid({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	isRequired: monoidAny,
	refs: getMonoid<Ref>(),
});
export const intercalateSerializedParameters = intercalate(monoidSerializedParameter, array);
