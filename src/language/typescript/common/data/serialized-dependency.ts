import { pipe } from 'fp-ts/lib/pipeable';
import { groupBy, head } from 'fp-ts/lib/NonEmptyArray';
import { collect } from 'fp-ts/lib/Record';
import { uniqString } from '../../../../utils/array';
import { getMonoid as getArrayMonoid } from 'fp-ts/lib/Array';

export const EMPTY_DEPENDENCIES: SerializedDependency[] = [];

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
		pipe(
			dependencies,
			groupBy(dependency => dependency.path),
		),
		collect((key, dependencies) => {
			const names = uniqString(dependencies.map(dependency => dependency.name));
			return `import { ${names.join(',')} } from '${head(dependencies).path}';`;
		}),
	).join('');

export const monoidDependencies = getArrayMonoid<SerializedDependency>();
const dependencyOption = serializedDependency('Option', 'fp-ts/lib/Option');
const dependencyOptionFromNullable = serializedDependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable');
export const OPTION_DEPENDENCIES: SerializedDependency[] = [dependencyOption, dependencyOptionFromNullable];
