import {
	monoidDependencies,
	OPTION_DEPENDENCIES,
	serializedDependency,
	SerializedDependency,
} from './serialized-dependency';
import { fold, getStructMonoid, Monoid, monoidString } from 'fp-ts/lib/Monoid';
import { intercalate } from 'fp-ts/lib/Foldable';
import { array, getMonoid, uniq } from 'fp-ts/lib/Array';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { getRelativePath, Ref } from '../../../../utils/ref';
import { getIOName, getTypeName } from '../utils';
import { concatIfL } from '../../../../utils/array';
import { when } from '../../../../utils/string';
import { head, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

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
const eqSerializedTypeByTypeAndIO: Eq<SerializedType> = getStructEq<Pick<SerializedType, 'type' | 'io'>>({
	type: eqString,
	io: eqString,
});
export const uniqSerializedTypesByTypeAndIO = uniq(eqSerializedTypeByTypeAndIO);
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
export const SERIALIZED_BOOLEAN_TYPE = serializedType(
	'boolean',
	'boolean',
	[serializedDependency('boolean', 'io-ts')],
	[],
);
export const SERIALIZED_NUMERIC_TYPE = serializedType(
	'number',
	'number',
	[serializedDependency('number', 'io-ts')],
	[],
);
export const SERIALIZED_DATE_TYPE = serializedType(
	'Date',
	'DateFromISOString',
	[serializedDependency('DateFromISOString', 'io-ts-types/lib/DateFromISOString')],
	[],
);
export const SERIALIZED_STRING_TYPE = serializedType('string', 'string', [serializedDependency('string', 'io-ts')], []);
export const SERIALIZED_NULL_TYPE = serializedType(
	'null',
	'literal(null)',
	[serializedDependency('literal', 'io-ts')],
	[],
);

export const getSerializedPropertyType = (name: string, isRequired: boolean) => (
	serialized: SerializedType,
): SerializedType =>
	isRequired
		? serializedType(
				`${name}: ${serialized.type}`,
				`${name}: ${serialized.io}`,
				serialized.dependencies,
				serialized.refs,
		  )
		: serializedType(
				`${name}: Option<${serialized.type}>`,
				`${name}: optionFromNullable(${serialized.io})`,
				[...serialized.dependencies, ...OPTION_DEPENDENCIES],
				serialized.refs,
		  );

export const getSerializedArrayType = (name?: string) => (serialized: SerializedType): SerializedType =>
	serializedType(
		`Array<${serialized.type}>`,
		`array(${serialized.io}${when(name !== undefined, `, '${name}'`)})`,
		[...serialized.dependencies, serializedDependency('array', 'io-ts')],
		serialized.refs,
	);

export const getSerializedRefType = (from: Ref) => (to: Ref): SerializedType => {
	const isRecursive = from.$ref === to.$ref;
	const p = getRelativePath(from, to);
	const type = getTypeName(to.name);
	const io = getIOName(to.name);
	const ref = to.name === type ? to : { ...to, name: type };
	const dependencies = concatIfL(!isRecursive, [], () => [
		serializedDependency(type, p),
		serializedDependency(io, p),
	]);
	return serializedType(type, io, dependencies, [ref]);
};

export const getSerializedObjectType = (name?: string) => (serialized: SerializedType): SerializedType =>
	serializedType(
		`{ ${serialized.type} }`,
		`type({ ${serialized.io} }${when(name !== undefined, `, '${name}'`)})`,
		[...serialized.dependencies, serializedDependency('type', 'io-ts')],
		serialized.refs,
	);

export const getSerializedDictionaryType = (name?: string) => (serialized: SerializedType): SerializedType =>
	serializedType(
		`{ [key: string]: ${serialized.type} }`,
		`record(string, ${serialized.io}${when(name !== undefined, `, '${name}'`)})`,
		[...serialized.dependencies, serializedDependency('record', 'io-ts'), serializedDependency('string', 'io-ts')],
		serialized.refs,
	);

export const getSerializedRecursiveType = (from: Ref, shouldTrackRecursion: boolean) => (
	serialized: SerializedType,
): SerializedType => {
	const typeName = getTypeName(from.name);
	const ioName = getIOName(from.name);
	return shouldTrackRecursion && serialized.refs.some(ref => ref.$ref === from.$ref)
		? serializedType(
				serialized.type,
				`recursion<${typeName}, unknown>('${ioName}', ${ioName} => ${serialized.io})`,
				[...serialized.dependencies, serializedDependency('recursion', 'io-ts')],
				serialized.refs,
		  )
		: serialized;
};

export const getSerializedUnionType = (serialized: NonEmptyArray<SerializedType>): SerializedType => {
	if (serialized.length === 1) {
		return head(serialized);
	} else {
		const intercalated = intercalateSerializedTypes(serializedType(' | ', ',', [], []), serialized);
		return serializedType(
			intercalated.type,
			`union([${intercalated.io}])`,
			[...intercalated.dependencies, serializedDependency('union', 'io-ts')],
			intercalated.refs,
		);
	}
};

export const getSerializedIntersectionType = (serialized: NonEmptyArray<SerializedType>): SerializedType => {
	if (serialized.length === 1) {
		return head(serialized);
	} else {
		const intercalated = intercalateSerializedTypes(serializedType(' & ', ',', [], []), serialized);
		return serializedType(
			intercalated.type,
			`intersection([${intercalated.io}])`,
			[...intercalated.dependencies, serializedDependency('intersection', 'io-ts')],
			intercalated.refs,
		);
	}
};
