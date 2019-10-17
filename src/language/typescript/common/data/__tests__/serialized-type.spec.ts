import { array, assert, boolean, property, string, tuple } from 'fast-check';
import {
	getSerializedArrayType,
	getSerializedPropertyType,
	getSerializedRefType,
	serializedType,
} from '../serialized-type';
import { serializedDependencyArbitrary } from './serialized-dependency.spec';
import { serializedDependency } from '../serialized-dependency';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { buildRelativePath } from '../../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { arbitrary } from '../../../../../utils/fast-check';
import { none, some } from 'fp-ts/lib/Option';
import { getIOName, getTypeName } from '../../utils';

export const serializedTypeArbitrary = tuple(
	string(),
	string(),
	array(serializedDependencyArbitrary),
	pipe(array($refArbitrary)),
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
	describe('getSerializedRefType', () => {
		const rootName = string();
		const cwd = string();
		it('should serialize non recursive', () => {
			const ref = pipe(
				tuple(rootName, $refArbitrary),
				arbitrary.filterMap(([rootName, ref]) => (ref.name.trim() !== rootName.trim() ? some(ref) : none)),
			);
			assert(
				property(rootName, cwd, ref, (rootName, cwd, ref) => {
					const serialized = getSerializedRefType(cwd)(ref);
					const type = getTypeName(ref.name);
					const io = getIOName(ref.name);
					const p = buildRelativePath(cwd, ref);

					const expected = serializedType(
						type,
						io,
						[serializedDependency(type, p), serializedDependency(io, p)],
						[ref],
					);

					expect(serialized).toEqual(expected);
				}),
			);
		});
		xit('should serialize recursive skipping dependencies', () => {
			const data = pipe(
				tuple(rootName, $refArbitrary),
				arbitrary.filterMap(([rootName, ref]) => (ref.name === rootName ? some({ ref, rootName }) : none)),
			);
			assert(
				property(cwd, data, (cwd, data) => {
					const { ref } = data;
					const serialized = getSerializedRefType(cwd)(ref);
					const type = getTypeName(ref.name);
					const io = getIOName(ref.name);

					const expected = serializedType(type, io, [], [ref]);

					expect(serialized).toEqual(expected);
				}),
			);
		});
	});
});
