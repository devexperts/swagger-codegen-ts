import { PathItemObject, PathItemObjectCodec } from '../../../../schema/2.0/path-item-object';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { isSome, map, Option } from 'fp-ts/lib/Option';
import { serializeOperationObject } from './operation-object';
import { array, flatten } from 'fp-ts/lib/Array';
import { Dictionary } from '../../../../utils/types';
import { file, File } from '../../../../utils/fs';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize } from '@devexperts/utils/dist/string';
import { Either } from 'fp-ts/lib/Either';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { either, nonEmptyArray, option, record } from 'fp-ts';
import { getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/client';
import { OperationObject } from '../../../../schema/2.0/operation-object';
import { tuple } from 'fp-ts/lib/function';
import { uniqString } from '../../../../utils/array';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { ask } from 'fp-ts/lib/Reader';
import { Context } from '../../common/utils';

const serializePath = combineReader(ask<Context>(), serializeOperationObject, (e, serializeOperationObject) => {
	const run = (from: Ref, url: string, item: PathItemObject): Either<Error, SerializedType> => {
		if (isSome(item.$ref)) {
			const $ref = item.$ref.value;
			return pipe(
				e.resolveRef({ $ref }),
				PathItemObjectCodec.decode,
				either.mapLeft(() => new Error(`Unable to resolve PathItem $ref: "${$ref}"`)),
				either.chain(resolved => run(from, url, resolved)),
			);
		} else {
			const get = pipe(
				item.get,
				map(operation => serializeOperationObject(from, url, 'GET', operation, item)),
			);
			const put = pipe(
				item.put,
				map(operation => serializeOperationObject(from, url, 'PUT', operation, item)),
			);
			const post = pipe(
				item.post,
				map(operation => serializeOperationObject(from, url, 'POST', operation, item)),
			);
			const remove = pipe(
				item.delete,
				map(operation => serializeOperationObject(from, url, 'DELETE', operation, item)),
			);
			const options = pipe(
				item.options,
				map(operation => serializeOperationObject(from, url, 'OPTIONS', operation, item)),
			);
			const head = pipe(
				item.head,
				map(operation => serializeOperationObject(from, url, 'HEAD', operation, item)),
			);
			const patch = pipe(
				item.patch,
				map(operation => serializeOperationObject(from, url, 'PATCH', operation, item)),
			);
			const operations = [get, put, post, remove, options, head, patch];
			return pipe(
				operations,
				array.compact,
				sequenceEither,
				either.map(foldSerializedTypes),
			);
		}
	};
	return run;
});

export const serializePathGroup = combineReader(
	serializePath,
	serializePath => (from: Ref, name: string, group: Dictionary<PathItemObject>): Either<Error, File> => {
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
	},
);

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

export const serializePathItemObjectTags = (pathItemObject: PathItemObject): Option<string> => {
	const operations = [
		pathItemObject.get,
		pathItemObject.post,
		pathItemObject.put,
		pathItemObject.delete,
		pathItemObject.options,
		pathItemObject.head,
		pathItemObject.patch,
	];
	return pipe(
		nonEmptyArray.fromArray(array.compact(operations)),
		option.map(operations => uniqString(flatten(array.compact(operations.map(operation => operation.tags))))),
		option.chain(nonEmptyArray.fromArray),
		option.map(tags => tags.join('').replace(/\s/g, '')),
	);
};
