import { array, assert, boolean, property, string, tuple } from 'fast-check';
import {
	getSerializedArrayType,
	getSerializedPropertyType,
	serializedType,
} from '../serialized-type';
import { serializedDependencyArbitrary } from './serialized-dependency.spec';
import { serializedDependency } from '../serialized-dependency';

export const serializedTypeArbitrary = tuple(
	string(),
	string(),
	array(serializedDependencyArbitrary),
	array(string()),
).map(([type, io, dependencies, refs]) => serializedType(type, io, dependencies, refs));

describe('SerializedType', () => {
	it('getSerializedArrayType', () => {
		assert(
			property(serializedTypeArbitrary, s => {
				expect(getSerializedArrayType(s)).toEqual(
					serializedType(
						`Array<${s.type}>`,
						`array(${s.io})`,
						[...s.dependencies, serializedDependency('array', 'io-ts')],
						s.refs,
					),
				);
			}),
		);
	});
	it('getSerializedPropertyType', () => {
		assert(
			property(string(), string(), string(), boolean(), (name, type, io, isRequired) => {
				const serialized = getSerializedPropertyType(name, type, io, isRequired);
				const expected = isRequired
					? serializedType(`${name}: ${type}`, `${name}: ${io}`, [], [])
					: serializedType(
							`${name}: Option<${type}>`,
							`${name}: optionFromNullable(${io})`,
							[
								serializedDependency('Option', 'fp-ts/lib/Option'),
								serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable'),
							],
							[],
					  );
				expect(serialized).toEqual(expected);
			}),
		);
	});
});
