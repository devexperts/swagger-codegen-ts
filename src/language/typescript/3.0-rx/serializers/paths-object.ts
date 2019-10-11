import { OpenAPIV3 } from 'openapi-types';
import { directory, Directory, file, File } from '../../../../fs';
import { collect } from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializePathItemObject, serializePathItemObjectTags } from './path-item-object';
import { Dictionary, serializeDictionary } from '../../../../utils/types';
import { getOrElse } from '../../../../utils/nullable';
import { foldSerializedTypes } from '../../common/data/serialized-type';
import { dependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { getRelativeClientPath } from '../../common/utils';
import { decapitalize } from '@devexperts/utils/dist/string';
import { Either, map } from 'fp-ts/lib/Either';
import { sequenceEither } from '../../../../utils/either';
import { Dereference } from '../utils';

export const serializePathsObject = (
	dereference: Dereference,
	pathsObject: OpenAPIV3.PathsObject,
): Either<Error, Directory> =>
	pipe(
		groupPathsByTag(pathsObject),
		collect((name, groupped) => serializeGrouppedPaths(dereference, name, groupped, './controllers')),
		sequenceEither,
		map(children => directory('paths', children)),
	);

const groupPathsByTag = (pathsObject: OpenAPIV3.PathsObject): Dictionary<OpenAPIV3.PathsObject> => {
	const keys = Object.keys(pathsObject);
	const result: Record<string, OpenAPIV3.PathsObject> = {};
	for (const key of keys) {
		const path = pathsObject[key];
		const tag = pipe(
			serializePathItemObjectTags(path),
			getOrElse(() => 'Unknown'),
		);
		result[tag] = {
			...(result[tag] || {}),
			[key]: path,
		};
	}
	return result;
};

const serializeGrouppedPaths = (
	dereference: Dereference,
	name: string,
	groupped: OpenAPIV3.PathsObject,
	cwd: string,
): Either<Error, File> => {
	const groupName = `${name}Controller`;
	return pipe(
		serializeDictionary(groupped, (pattern, item) =>
			serializePathItemObject(dereference, pattern, item, groupName, cwd),
		),
		sequenceEither,
		map(foldSerializedTypes),
		map(serialized => {
			const dependencies = serializeDependencies([
				...serialized.dependencies,
				dependency('Reader', 'fp-ts/lib/Reader'),
				dependency('APIClient', getRelativeClientPath(cwd)),
			]);
			return file(
				`${groupName}.ts`,
				`
					${dependencies}
					
					export interface ${groupName} {
						${serialized.type}
					}
					
					export const ${decapitalize(groupName)}: Reader<{ apiClient: APIClient }, ${groupName}> = e => ({
						${serialized.io}
					})
				`,
			);
		}),
	);
};
