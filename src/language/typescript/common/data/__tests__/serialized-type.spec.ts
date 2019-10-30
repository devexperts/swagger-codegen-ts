import { array, assert, boolean, constant, oneof, property, string, tuple } from 'fast-check';
import {
	getSerializedArrayType,
	getSerializedDictionaryType,
	getSerializedObjectType,
	getSerializedPropertyType,
	getSerializedRefType,
	serializedType,
} from '../serialized-type';
import { serializedDependency } from '../serialized-dependency';
import { $refArbitrary } from '../../../../../utils/__tests__/ref.spec';
import { getRelativePath } from '../../../../../utils/ref';
import { pipe } from 'fp-ts/lib/pipeable';
import { arbitrary } from '../../../../../utils/fast-check';
import { none, some } from 'fp-ts/lib/Option';
import { getIOName, getTypeName } from '../../utils';
import { when } from '../../../../../utils/string';

const serializedDependencyArbitrary = tuple(string(), string()).map(([name, path]) => serializedDependency(name, path));

export const serializedTypeArbitrary = tuple(
	string(),
	string(),
	array(serializedDependencyArbitrary),
	pipe(array($refArbitrary)),
).map(([type, io, dependencies, refs]) => serializedType(type, io, dependencies, refs));

const name = oneof(string(), constant(undefined));

describe('SerializedType', () => {
	it('getSerializedArrayType', () => {
		assert(
			property(serializedTypeArbitrary, name, (s, name) => {
				expect(
					pipe(
						s,
						getSerializedArrayType(name),
					),
				).toEqual(
					serializedType(
						`Array<${s.type}>`,
						`array(${s.io}${when(name !== undefined, `, '${name}'`)})`,
						[...s.dependencies, serializedDependency('array', 'io-ts')],
						s.refs,
					),
				);
			}),
		);
	});
	it('getSerializedPropertyType', () => {
		assert(
			property(string(), serializedTypeArbitrary, boolean(), (name, s, isRequired) => {
				const serialized = getSerializedPropertyType(name, isRequired)(s);
				const expected = isRequired
					? serializedType(`${name}: ${s.type}`, `${name}: ${s.io}`, s.dependencies, s.refs)
					: serializedType(
							`${name}: Option<${s.type}>`,
							`${name}: optionFromNullable(${s.io})`,
							[
								...s.dependencies,
								serializedDependency('Option', 'fp-ts/lib/Option'),
								serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable'),
							],
							s.refs,
					  );
				expect(serialized).toEqual(expected);
			}),
		);
	});
	describe('getSerializedRefType', () => {
		it('should serialize non recursive', () => {
			const refs = pipe(
				tuple($refArbitrary, $refArbitrary),
				arbitrary.filterMap(([from, to]) =>
					to.$ref !== from.$ref
						? some({
								from,
								to,
						  })
						: none,
				),
			);
			assert(
				property(refs, refs => {
					const { from, to } = refs;
					const serialized = getSerializedRefType(from)(to);
					const type = getTypeName(to.name);
					const io = getIOName(to.name);
					const p = getRelativePath(from, to);

					const expected = serializedType(
						type,
						io,
						[serializedDependency(type, p), serializedDependency(io, p)],
						[to],
					);

					expect(serialized).toEqual(expected);
				}),
			);
		});
		it('should skip self-reference dependencies', () => {
			assert(
				property($refArbitrary, ref => {
					const type = getTypeName(ref.name);
					const io = getIOName(ref.name);
					const expected = serializedType(type, io, [], [ref]);
					const serialized = getSerializedRefType(ref)(ref);
					expect(serialized).toEqual(expected);
				}),
			);
		});
	});
	it('getSerializedObjectType', () => {
		assert(
			property(serializedTypeArbitrary, oneof(string(), constant(undefined)), (s, name) => {
				expect(getSerializedObjectType(name)(s)).toEqual(
					serializedType(
						`{ ${s.type} }`,
						`type({ ${s.io} }${when(name !== undefined, `, '${name}'`)})`,
						[...s.dependencies, serializedDependency('type', 'io-ts')],
						s.refs,
					),
				);
			}),
		);
	});
	it('getSerializedDictionaryType', () => {
		assert(
			property(serializedTypeArbitrary, string(), (s, name) => {
				expect(getSerializedDictionaryType(name)(s)).toEqual(
					serializedType(
						`{ [key: string]: ${s.type} }`,
						`record(string, ${s.io}${when(name !== undefined, `, '${name}'`)})`,
						[
							...s.dependencies,
							serializedDependency('record', 'io-ts'),
							serializedDependency('string', 'io-ts'),
						],
						s.refs,
					),
				);
			}),
		);
	});
});
