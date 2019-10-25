import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'fp-ts/lib/Option';
import { serializeOperationObject } from './operation-object';
import { array } from 'fp-ts/lib/Array';
import { Dictionary } from '../../../../utils/types';
import { file, File } from '../../../../utils/fs';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize } from '@devexperts/utils/dist/string';
import { getRelativeClientPath } from '../../common/utils';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { either, record } from 'fp-ts';

export const serializePathGroup = (
	name: string,
	group: Dictionary<PathItemObject>,
	cwd: string,
): Either<Error, File> => {
	const groupName = `${name}Controller`;
	return pipe(
		group,
		record.collect((url, item) => serializePath(url, item, groupName, cwd)),
		sequenceEither,
		either.map(foldSerializedTypes),
		either.map(serialized => {
			const dependencies = serializeDependencies([
				...serialized.dependencies,
				serializedDependency('asks', 'fp-ts/lib/Reader'),
				serializedDependency('APIClient', getRelativeClientPath(cwd)),
			]);
			return file(
				`${groupName}.ts`,
				` 
					${dependencies}
				
					export interface ${groupName} {
						${serialized.type}
					}
					
					export const ${decapitalize(groupName)} = asks((e: { apiClient: APIClient }): ${groupName} => ({
						${serialized.io}
					}));
				`,
			);
		}),
	);
};

const serializePath = (
	url: string,
	item: PathItemObject,
	rootName: string,
	cwd: string,
): Either<Error, SerializedType> => {
	const get = pipe(
		item.get,
		map(operation => serializeOperationObject(url, 'GET', operation, rootName, cwd)),
	);
	const put = pipe(
		item.put,
		map(operation => serializeOperationObject(url, 'PUT', operation, rootName, cwd)),
	);
	const post = pipe(
		item.post,
		map(operation => serializeOperationObject(url, 'POST', operation, rootName, cwd)),
	);
	const remove = pipe(
		item.delete,
		map(operation => serializeOperationObject(url, 'DELETE', operation, rootName, cwd)),
	);
	const options = pipe(
		item.options,
		map(operation => serializeOperationObject(url, 'OPTIONS', operation, rootName, cwd)),
	);
	const head = pipe(
		item.head,
		map(operation => serializeOperationObject(url, 'HEAD', operation, rootName, cwd)),
	);
	const patch = pipe(
		item.patch,
		map(operation => serializeOperationObject(url, 'PATCH', operation, rootName, cwd)),
	);
	const operations = [get, put, post, remove, options, head, patch];
	return pipe(
		operations,
		array.compact,
		sequenceEither,
		either.map(foldSerializedTypes),
	);
};
