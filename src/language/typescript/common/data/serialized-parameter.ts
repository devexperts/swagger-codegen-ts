import { SerializedType } from './serialized-type';
import { SerializedDependency, monoidDependencies } from './serialized-dependency';
import { getStructMonoid, Monoid, monoidAny, monoidString } from 'fp-ts/lib/Monoid';
import { monoidStrings } from '../../../../utils/monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array } from 'fp-ts/lib/Array';

export interface SerializedParameter extends SerializedType {
	readonly isRequired: boolean;
}

export const serializedParameter = (
	type: string,
	io: string,
	isRequired: boolean,
	dependencies: SerializedDependency[],
	refs: string[],
): SerializedParameter => ({
	type,
	io,
	isRequired,
	dependencies,
	refs,
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
	refs: monoidStrings,
});
export const intercalateSerializedParameters = intercalate(monoidSerializedParameter, array);
