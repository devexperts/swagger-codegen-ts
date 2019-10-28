import { PathsObject } from '../../../../schema/2.0/paths-object';
import { directory, Directory } from '../../../../utils/fs';
import { serializePathGroup, serializePathItemObjectTags } from './path-item-object';
import { CONTROLLERS_DIRECTORY } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';
import { addPathParts, Ref } from '../../../../utils/ref';
import { Dictionary } from '../../../../utils/types';
import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { camelize } from '@devexperts/utils/dist/string';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';

export const serializePaths = combineReader(
	serializePathGroup,
	serializePathGroup => (from: Ref, paths: PathsObject): Either<Error, Directory> =>
		pipe(
			groupPathsByTag(paths),
			record.collect((name, group) => {
				return pipe(
					from,
					addPathParts(`${name}Controller`),
					either.chain(from => serializePathGroup(from, name, group)),
				);
			}),
			sequenceEither,
			either.map(serialized => directory(CONTROLLERS_DIRECTORY, serialized)),
		),
);

const groupPathsByTag = (pathsObject: PathsObject): Dictionary<Dictionary<PathItemObject>> => {
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
