import { OpenAPIV3 } from 'openapi-types';
import * as nullable from '../../../../utils/nullable';
import { flatten } from 'fp-ts/lib/Array';
import { uniqString } from '../../../../utils/array';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { serializeOperationObject } from './operation-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '../../../../utils/either';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { either } from 'fp-ts';
import { compactNullables, Nullable } from '../../../../utils/nullable';

export const serializePathItemObject = combineReader(
	serializeOperationObject,
	serializeOperationObject => (
		pattern: string,
		item: OpenAPIV3.PathItemObject,
		rootName: string,
		cwd: string,
	): Either<Error, SerializedType> => {
		const get = pipe(
			item.get,
			nullable.map(serializeOperationObject(pattern, 'GET', rootName, cwd)),
		);
		const post = pipe(
			item.post,
			nullable.map(serializeOperationObject(pattern, 'POST', rootName, cwd)),
		);
		const put = pipe(
			item.put,
			nullable.map(serializeOperationObject(pattern, 'PUT', rootName, cwd)),
		);
		const remove = pipe(
			item.delete,
			nullable.map(serializeOperationObject(pattern, 'DELETE', rootName, cwd)),
		);
		const patch = pipe(
			item.patch,
			nullable.map(serializeOperationObject(pattern, 'PATCH', rootName, cwd)),
		);
		const head = pipe(
			item.head,
			nullable.map(serializeOperationObject(pattern, 'HEAD', rootName, cwd)),
		);
		const options = pipe(
			item.options,
			nullable.map(serializeOperationObject(pattern, 'OPTIONS', rootName, cwd)),
		);
		return pipe(
			compactNullables([get, post, put, remove, patch, head, options]),
			sequenceEither,
			either.map(foldSerializedTypes),
		);
	},
);

export const serializePathItemObjectTags = (pathItemObject: OpenAPIV3.PathItemObject): Nullable<string> => {
	const operations = compactNullables([
		pathItemObject.get,
		pathItemObject.post,
		pathItemObject.put,
		pathItemObject.delete,
		pathItemObject.options,
		pathItemObject.head,
		pathItemObject.patch,
		pathItemObject.trace,
	]);
	if (operations.length > 0) {
		const tags = uniqString(flatten(compactNullables(operations.map(operation => operation.tags))));

		if (tags.length > 0) {
			return tags.join('').replace(/\s/g, '');
		}
	}
};
