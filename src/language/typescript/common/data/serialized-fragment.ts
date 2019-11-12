import { serializedDependency, SerializedDependency, uniqSerializedDependencies } from './serialized-dependency';
import { fold, getStructMonoid, Monoid, monoidString } from 'fp-ts/lib/Monoid';
import { getMonoid } from 'fp-ts/lib/Array';
import { intercalate } from 'fp-ts/lib/Foldable';
import { nonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { Ref, uniqRefs } from '../../../../utils/ref';
import { ProjectMany } from '@devexperts/utils/dist/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { array } from 'fp-ts';

export interface SerializedFragment {
	readonly value: string;
	readonly dependencies: SerializedDependency[];
	readonly refs: Ref[];
}

export const serializedFragment = (
	value: string,
	dependencies: SerializedDependency[],
	refs: Ref[],
): SerializedFragment => ({
	value,
	dependencies: uniqSerializedDependencies(dependencies),
	refs: uniqRefs(refs),
});

export const monoidSerializedFragment: Monoid<SerializedFragment> = getStructMonoid({
	value: monoidString,
	dependencies: getMonoid<SerializedDependency>(),
	refs: getMonoid<Ref>(),
});

export const intercalateSerializedFragments = intercalate(monoidSerializedFragment, nonEmptyArray);
export const foldSerializedFragments = fold(monoidSerializedFragment);

export function combineFragments(a: SerializedFragment, p: (a: string) => string): SerializedFragment;
export function combineFragments(
	a: SerializedFragment,
	b: SerializedFragment,
	p: (a: string, b: string) => string,
): SerializedFragment;
export function combineFragments(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	p: (a: string, b: string, c: string) => string,
): SerializedFragment;
export function combineFragments(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	p: (a: string, b: string, c: string, d: string) => string,
): SerializedFragment;
export function combineFragments(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	e: SerializedFragment,
	p: (a: string, b: string, c: string, d: string, e: string) => string,
): SerializedFragment;
export function combineFragments(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	e: SerializedFragment,
	f: SerializedFragment,
	p: (a: string, b: string, c: string, d: string, e: string, f: string) => string,
): SerializedFragment;
export function combineFragments(...args: Array<SerializedFragment | ProjectMany<string, string>>): SerializedFragment {
	const fragments = args.slice(0, -1) as SerializedFragment[];
	const project = args[args.length - 1] as ProjectMany<string, string>;
	const fragment = project(...fragments.map(f => f.value));
	const dependencies = array.flatten(fragments.map(f => f.dependencies));
	const refs = array.flatten(fragments.map(f => f.refs));
	return serializedFragment(fragment, dependencies, refs);
}

export function combineFragmentsK(a: SerializedFragment, p: (a: string) => SerializedFragment): SerializedFragment;
export function combineFragmentsK(
	a: SerializedFragment,
	b: SerializedFragment,
	p: (a: string, b: string) => SerializedFragment,
): SerializedFragment;
export function combineFragmentsK(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	p: (a: string, b: string, c: string) => SerializedFragment,
): SerializedFragment;
export function combineFragmentsK(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	p: (a: string, b: string, c: string, d: string) => SerializedFragment,
): SerializedFragment;
export function combineFragmentsK(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	e: SerializedFragment,
	p: (a: string, b: string, c: string, d: string, e: string) => SerializedFragment,
): SerializedFragment;
export function combineFragmentsK(
	a: SerializedFragment,
	b: SerializedFragment,
	c: SerializedFragment,
	d: SerializedFragment,
	e: SerializedFragment,
	f: SerializedFragment,
	p: (a: string, b: string, c: string, d: string, e: string, f: string) => SerializedFragment,
): SerializedFragment;
export function combineFragmentsK(
	...args: Array<SerializedFragment | ProjectMany<string, SerializedFragment>>
): SerializedFragment {
	const fragments = args.slice(0, -1) as SerializedFragment[];
	const project = args[args.length - 1] as ProjectMany<string, SerializedFragment>;
	const fragment = project(...fragments.map(f => f.value));
	const dependencies = array.flatten(fragments.map(f => f.dependencies));
	const refs = array.flatten(fragments.map(f => f.refs));
	return serializedFragment(fragment.value, dependencies.concat(fragment.dependencies), refs.concat(fragment.refs));
}

export const getSerializedOptionCallFragment = (
	nullable: boolean,
	f: SerializedFragment,
	a: SerializedFragment,
): SerializedFragment =>
	combineFragmentsK(f, a, (fn, a) =>
		nullable
			? serializedFragment(
					`pipe(
							${a},
							option.fromNullable,
							option.map(${fn}),
						)`,
					[serializedDependency('option', 'fp-ts'), serializedDependency('pipe', 'fp-ts/lib/pipeable')],
					[],
			  )
			: serializedFragment(`some((${fn})(${a}))`, [serializedDependency('some', 'fp-ts/lib/Option')], []),
	);
