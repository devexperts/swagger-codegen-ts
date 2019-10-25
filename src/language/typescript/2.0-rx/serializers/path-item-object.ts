import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'fp-ts/lib/Option';
import { serializeOperationObject } from './operation-object';
import { array, flatten } from 'fp-ts/lib/Array';
import { Dictionary } from '../../../../utils/types';
import { file, File } from '../../../../utils/fs';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize } from '@devexperts/utils/dist/string';
import { Either } from 'fp-ts/lib/Either';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { either, record } from 'fp-ts';
import { getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/client';
import { OperationObject } from '../../../../schema/2.0/operation-object';
import { tuple } from 'fp-ts/lib/function';
import { uniqString } from '../../../../utils/array';

export const serializePathGroup = (from: Ref, name: string, group: Dictionary<PathItemObject>): Either<Error, File> => {
	const serialized = pipe(
		group,
		record.collect((url, item) => serializePath(from, url, item)),
		sequenceEither,
		either.map(foldSerializedTypes),
	);

	return combineEither(serialized, clientRef, (serialized, clientRef) => {
		const dependencies = serializeDependencies([
			...serialized.dependencies,
			serializedDependency('asks', 'fp-ts/lib/Reader'),
			serializedDependency('APIClient', getRelativePath(from, clientRef)),
		]);
		return file(
			`${from.name}.ts`,
			` 
					${dependencies} 
				
					export interface ${from.name} {
						${serialized.type}
					}
					
					export const ${decapitalize(from.name)} = asks((e: { apiClient: APIClient }): ${from.name} => ({
						${serialized.io}
					}));
				`,
		);
	});
};

const serializePath = (from: Ref, url: string, item: PathItemObject): Either<Error, SerializedType> => {
	const get = pipe(
		item.get,
		map(operation => serializeOperationObject(from, url, 'GET', operation)),
	);
	const put = pipe(
		item.put,
		map(operation => serializeOperationObject(from, url, 'PUT', operation)),
	);
	const post = pipe(
		item.post,
		map(operation => serializeOperationObject(from, url, 'POST', operation)),
	);
	const remove = pipe(
		item.delete,
		map(operation => serializeOperationObject(from, url, 'DELETE', operation)),
	);
	const options = pipe(
		item.options,
		map(operation => serializeOperationObject(from, url, 'OPTIONS', operation)),
	);
	const head = pipe(
		item.head,
		map(operation => serializeOperationObject(from, url, 'HEAD', operation)),
	);
	const patch = pipe(
		item.patch,
		map(operation => serializeOperationObject(from, url, 'PATCH', operation)),
	);
	const operations = [get, put, post, remove, options, head, patch];
	return pipe(
		operations,
		array.compact,
		sequenceEither,
		either.map(foldSerializedTypes),
	);
};

const getOperationsFromPath = (path: PathItemObject): Dictionary<OperationObject> => {
	const result: Record<string, OperationObject> = {};
	const operations = array.compact([
		pipe(
			path.get,
			map(operation => tuple('get', operation)),
		),
		pipe(
			path.post,
			map(operation => tuple('post', operation)),
		),
		pipe(
			path.put,
			map(operation => tuple('put', operation)),
		),
		pipe(
			path.delete,
			map(operation => tuple('delete', operation)),
		),
		pipe(
			path.head,
			map(operation => tuple('head', operation)),
		),
		pipe(
			path.options,
			map(operation => tuple('options', operation)),
		),
		pipe(
			path.patch,
			map(operation => tuple('patch', operation)),
		),
	]);
	for (const [name, operation] of operations) {
		result[name] = operation;
	}
	return result;
};

export const getTagsFromPath = (path: PathItemObject): string[] => {
	const operations = getOperationsFromPath(path);
	const tags = flatten(array.compact(Object.keys(operations).map(key => operations[key].tags)));
	return uniqString(tags);
};
