import { directory, Directory, file, File } from '../../../../utils/fs';
import { collect } from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializePathItemObject, serializePathItemObjectTags } from './path-item-object';
import { Dictionary, serializeDictionary } from '../../../../utils/types';
import { foldSerializedTypes } from '../../common/data/serialized-type';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize, camelize } from '@devexperts/utils/dist/string';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { either, option } from 'fp-ts';
import { addPathParts, getRelativePath, Ref } from '../../../../utils/ref';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { applyTo } from '../../../../utils/function';
import { PathsObject } from '../../../../schema/3.0/paths-object';
import { clientRef } from '../../common/client';

const groupPathsByTag = (pathsObject: PathsObject): Dictionary<PathsObject> => {
	const keys = Object.keys(pathsObject);
	const result: Record<string, PathsObject> = {};
	for (const key of keys) {
		const path = pathsObject[key];
		const tag = pipe(
			serializePathItemObjectTags(path),
			option.map(p => camelize(p, false)),
			option.getOrElse(() => 'Unknown'),
		);
		result[tag] = {
			...(result[tag] || {}),
			[key]: path,
		};
	}
	return result;
};

const serializeGrouppedPaths = combineReader(
	serializePathItemObject,
	serializePathItemObject => (from: Ref) => (groupped: PathsObject): Either<Error, File> => {
		const serialized = pipe(
			serializeDictionary(groupped, (pattern, item) => serializePathItemObject(pattern, item, from)),
			sequenceEither,
			either.map(foldSerializedTypes),
		);
		return combineEither(serialized, clientRef, (serialized, clientRef) => {
			const dependencies = serializeDependencies([
				...serialized.dependencies,
				serializedDependency('Reader', 'fp-ts/lib/Reader'),
				serializedDependency('APIClient', getRelativePath(from, clientRef)),
			]);
			return file(
				`${from.name}.ts`,
				`
						${dependencies}
						
						export interface ${from.name} {
							${serialized.type}
						}
						
						export const ${decapitalize(from.name)}: Reader<{ apiClient: APIClient }, ${from.name}> = e => ({
							${serialized.io}
						})
					`,
			);
		});
	},
);

export const serializePathsObject = combineReader(
	serializeGrouppedPaths,
	serializeGrouppedPaths => (from: Ref) => (pathsObject: PathsObject): Either<Error, Directory> =>
		pipe(
			groupPathsByTag(pathsObject),
			collect((name, groupped) =>
				pipe(
					from,
					addPathParts(`${name}Controller`),
					either.map(serializeGrouppedPaths),
					either.chain(applyTo(groupped)),
				),
			),
			sequenceEither,
			either.map(children => directory('paths', children)),
		),
);
