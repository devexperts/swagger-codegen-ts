import { SerializedDependency, monoidDependencies } from './serialized-dependency';
import { fold, getStructMonoid, Monoid, monoidString } from 'fp-ts/lib/Monoid';
import { monoidStrings } from '../../../../utils/monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array } from 'fp-ts/lib/Array';

export interface SerializedType {
	readonly type: string;
	readonly io: string;
	readonly dependencies: SerializedDependency[];
	readonly refs: string[];
}

export const serializedType = (
	type: string,
	io: string,
	dependencies: SerializedDependency[],
	refs: string[],
): SerializedType => ({
	type,
	io,
	dependencies,
	refs,
});

export const monoidSerializedType: Monoid<SerializedType> = getStructMonoid({
	type: monoidString,
	io: monoidString,
	dependencies: monoidDependencies,
	refs: monoidStrings,
});

export const foldSerializedTypes = fold(monoidSerializedType);
export const intercalateSerializedTypes = intercalate(monoidSerializedType, array);
