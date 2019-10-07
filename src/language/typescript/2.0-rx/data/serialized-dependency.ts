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

export const dependency = (name: string, path: string): SerializedDependency => ({
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
const dependencyOption = dependency('Option', 'fp-ts/lib/Option');
const dependencyCreateOptionFromNullable = dependency('optionFromNullable', 'io-ts-types/lib/optionFromNullable');
export const OPTION_DEPENDENCIES: SerializedDependency[] = [dependencyOption, dependencyCreateOptionFromNullable];
