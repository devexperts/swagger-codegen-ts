import {
	EMPTY_DEPENDENCIES,
	monoidDependencies,
	OPTION_DEPENDENCIES,
	serializedDependency,
	SerializedDependency,
} from './serialized-dependency';
import { fold, getStructMonoid, Monoid, monoidString } from 'fp-ts/lib/Monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array, getMonoid, uniq } from 'fp-ts/lib/Array';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { buildRelativePath, getRelativePath, Ref } from '../../../../utils/ref';
import { getIOName, getTypeName } from '../utils';

export interface SerializedType {
	readonly type: string;
	readonly io: string;
	readonly dependencies: SerializedDependency[];
	readonly refs: Ref[];
}

export const serializedType = (
	type: string,
	io: string,
	dependencies: SerializedDependency[],
	refs: Ref[],
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
	refs: getMonoid<Ref>(),
});

export const foldSerializedTypes = fold(monoidSerializedType);
export const intercalateSerializedTypes = intercalate(monoidSerializedType, array);
const eqSerializedTypeWithoutDependencies: Eq<SerializedType> = getStructEq<Pick<SerializedType, 'type' | 'io'>>({
	type: eqString,
	io: eqString,
});
export const uniqSerializedTypesWithoutDependencies = uniq(eqSerializedTypeWithoutDependencies);
export const SERIALIZED_VOID_TYPE = serializedType(
	'void',
	'tvoid',
	[serializedDependency('void as tvoid', 'io-ts')],
	[],
);
export const SERIALIZED_UNKNOWN_TYPE = serializedType(
	'unknown',
	'unknown',
	[serializedDependency('unknown', 'io-ts')],
	[],
);

export const getSerializedPropertyType = (
	name: string,
	type: string,
	io: string,
	isRequired: boolean,
): SerializedType =>
	isRequired
		? serializedType(`${name}: ${type}`, `${name}: ${io}`, EMPTY_DEPENDENCIES, [])
		: serializedType(`${name}: Option<${type}>`, `${name}: optionFromNullable(${io})`, OPTION_DEPENDENCIES, []);

export const getSerializedArrayType = (serialized: SerializedType): SerializedType =>
	serializedType(
		`Array<${serialized.type}>`,
		`array(${serialized.io})`,
		[...serialized.dependencies, serializedDependency('array', 'io-ts')],
		serialized.refs,
	);
export const getSerializedRefType = (from: Ref) => (to: Ref): SerializedType => {
	const p = getRelativePath(from, to);
	const type = getTypeName(to.name);
	const io = getIOName(to.name);
	const ref = to.name === type ? to : { ...to, name: type };
	return serializedType(type, io, [serializedDependency(type, p), serializedDependency(io, p)], [ref]);
};
