import { pipe } from 'fp-ts/lib/pipeable';
import { groupBy, head } from 'fp-ts/lib/NonEmptyArray';
import { collect } from 'fp-ts/lib/Record';
import { join, uniqString } from '../../../../utils/array';
import { getMonoid as getArrayMonoid, uniq } from 'fp-ts/lib/Array';
import { Kind } from '../../../../utils/types';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { ord } from 'fp-ts';
import { ordString } from 'fp-ts/lib/Ord';

export interface SerializedDependency {
	readonly name: string;
	readonly path: string;
}

export const serializedDependency = (name: string, path: string): SerializedDependency => ({
	name,
	path,
});

export const serializeDependencies = (dependencies: SerializedDependency[]): string =>
	pipe(
		dependencies,
		groupBy(dependency => dependency.path),
		collect((key, dependencies) => {
			const names = pipe(uniqString(dependencies.map(dependency => dependency.name)), join(','));
			return `import { ${names} } from '${head(dependencies).path}';`;
		}),
		join(''),
	);

export const ordDependencyByPath = ord.contramap((dep: SerializedDependency) => dep.path)(ordString);
export const ordDependencyByName = ord.contramap((dep: SerializedDependency) => dep.name)(ordString);

export const monoidDependencies = getArrayMonoid<SerializedDependency>();
const dependencyOption = serializedDependency('Option', 'fp-ts/lib/Option');
const dependencyOptionFromNullable = serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable');
export const OPTION_DEPENDENCIES: SerializedDependency[] = [dependencyOption, dependencyOptionFromNullable];
export const LITERAL_DEPENDENCY = serializedDependency('literal', 'io-ts');

export const eqSerializedDependency: Eq<SerializedDependency> = getStructEq({
	name: eqString,
	path: eqString,
});
export const uniqSerializedDependencies = uniq(eqSerializedDependency);

export const getSerializedKindDependency = (kind: Kind): SerializedDependency => {
	switch (kind) {
		case 'HKT': {
			return serializedDependency('HKT', 'fp-ts/lib/HKT');
		}
		case '*': {
			return serializedDependency('Kind', 'fp-ts/lib/HKT');
		}
		case '* -> *': {
			return serializedDependency('Kind2', 'fp-ts/lib/HKT');
		}
	}
};
