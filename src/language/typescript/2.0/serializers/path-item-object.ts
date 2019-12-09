import { PathItemObject, PathItemObjectCodec } from '../../../../schema/2.0/path-item-object';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { isSome, map, Option } from 'fp-ts/lib/Option';
import { serializeOperationObject } from './operation-object';
import { array, flatten } from 'fp-ts/lib/Array';
import { Dictionary, Kind } from '../../../../utils/types';
import { file, File } from '../../../../utils/fs';
import { serializedDependency, serializeDependencies } from '../../common/data/serialized-dependency';
import { decapitalize } from '@devexperts/utils/dist/string';
import { Either } from 'fp-ts/lib/Either';
import { combineEither, sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { either, nonEmptyArray, option, record } from 'fp-ts';
import { ResolveRefContext, getRelativePath, Ref } from '../../../../utils/ref';
import { clientRef } from '../../common/bundled/client';
import { OperationObject } from '../../../../schema/2.0/operation-object';
import { tuple } from 'fp-ts/lib/function';
import { uniqString } from '../../../../utils/array';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { ask } from 'fp-ts/lib/Reader';

const serializePath = combineReader(
	ask<ResolveRefContext>(),
	serializeOperationObject,
	(e, serializeOperationObject) => {
		const run = (from: Ref, url: string, kind: Kind, item: PathItemObject): Either<Error, SerializedType> => {
			if (isSome(item.$ref)) {
				const $ref = item.$ref.value;
				return pipe(
					e.resolveRef($ref, PathItemObjectCodec),
					either.mapLeft(() => new Error(`Unable to resolve PathItem $ref: "${$ref}"`)),
					either.chain(resolved => run(from, url, kind, resolved)),
				);
			} else {
				const get = pipe(
					item.get,
					map(operation => serializeOperationObject(from, url, 'GET', kind, operation, item)),
				);
				const put = pipe(
					item.put,
					map(operation => serializeOperationObject(from, url, 'PUT', kind, operation, item)),
				);
				const post = pipe(
					item.post,
					map(operation => serializeOperationObject(from, url, 'POST', kind, operation, item)),
				);
				const remove = pipe(
					item.delete,
					map(operation => serializeOperationObject(from, url, 'DELETE', kind, operation, item)),
				);
				const options = pipe(
					item.options,
					map(operation => serializeOperationObject(from, url, 'OPTIONS', kind, operation, item)),
				);
				const head = pipe(
					item.head,
					map(operation => serializeOperationObject(from, url, 'HEAD', kind, operation, item)),
				);
				const patch = pipe(
					item.patch,
					map(operation => serializeOperationObject(from, url, 'PATCH', kind, operation, item)),
				);
				const operations = [get, put, post, remove, options, head, patch];
				return pipe(operations, array.compact, sequenceEither, either.map(foldSerializedTypes));
			}
		};
		return run;
	},
);

export const serializePathGroup = combineReader(
	serializePath,
	serializePath => (from: Ref, name: string, group: Dictionary<PathItemObject>): Either<Error, File> => {
		const serializedHKT = pipe(
			group,
			record.collect((url, item) => serializePath(from, url, 'HKT', item)),
			sequenceEither,
			either.map(foldSerializedTypes),
		);

		const serializedKind = pipe(
			group,
			record.collect((url, item) => serializePath(from, url, '*', item)),
			sequenceEither,
			either.map(foldSerializedTypes),
		);

		const serializedKind2 = pipe(
			group,
			record.collect((url, item) => serializePath(from, url, '* -> *', item)),
			sequenceEither,
			either.map(foldSerializedTypes),
		);

		return combineEither(
			serializedHKT,
			serializedKind,
			serializedKind2,
			clientRef,
			(serializedHKT, serializedKind, serializedKind2, clientRef) => {
				const dependencies = serializeDependencies([
					...serializedHKT.dependencies,
					...serializedKind.dependencies,
					...serializedKind2.dependencies,
					serializedDependency('HTTPClient', getRelativePath(from, clientRef)),
					serializedDependency('HTTPClient1', getRelativePath(from, clientRef)),
					serializedDependency('HTTPClient2', getRelativePath(from, clientRef)),
					serializedDependency('URIS', 'fp-ts/lib/HKT'),
					serializedDependency('URIS2', 'fp-ts/lib/HKT'),
				]);
				return file(
					`${from.name}.ts`,
					`
					${dependencies}

					export interface ${from.name}<F> {
						${serializedHKT.type}
					}

					export interface ${from.name}1<F extends URIS> {
						${serializedKind.type}
					}

					export interface ${from.name}2<F extends URIS2> {
						${serializedKind2.type}
					}

					export function ${decapitalize(from.name)}<F extends URIS2>(e: { httpClient: HTTPClient2<F> }): ${from.name}2<F>
					export function ${decapitalize(from.name)}<F extends URIS>(e: { httpClient: HTTPClient1<F> }): ${from.name}1<F>
					export function ${decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F>;
					export function ${decapitalize(from.name)}<F>(e: { httpClient: HTTPClient<F> }): ${from.name}<F> {
						return {
							${serializedHKT.io}
						}
					}
				`,
				);
			},
		);
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
