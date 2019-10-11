import { OpenAPIV3 } from 'openapi-types';
import { compactNullables, map as mapNullable, Nullable } from '../../../../utils/nullable';
import { flatten } from 'fp-ts/lib/Array';
import { uniqString } from '../../../../utils/array';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { serializeOperationObject } from './operation-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either, map as mapEither } from 'fp-ts/lib/Either';
import { sequenceEither } from '../../../../utils/either';
import { Dereference } from '../utils';

export const serializePathItemObject = (
	dereference: Dereference,
	pattern: string,
	item: OpenAPIV3.PathItemObject,
	rootName: string,
	cwd: string,
): Either<Error, SerializedType> => {
	const get = pipe(
		item.get,
		mapNullable(serializeOperationObject(dereference, pattern, 'GET', rootName, cwd)),
	);
	const post = pipe(
		item.post,
		mapNullable(serializeOperationObject(dereference, pattern, 'POST', rootName, cwd)),
	);
	const put = pipe(
		item.put,
		mapNullable(serializeOperationObject(dereference, pattern, 'PUT', rootName, cwd)),
	);
	const remove = pipe(
		item.delete,
		mapNullable(serializeOperationObject(dereference, pattern, 'DELETE', rootName, cwd)),
	);
	const patch = pipe(
		item.patch,
		mapNullable(serializeOperationObject(dereference, pattern, 'PATCH', rootName, cwd)),
	);
	const head = pipe(
		item.head,
		mapNullable(serializeOperationObject(dereference, pattern, 'HEAD', rootName, cwd)),
	);
	const options = pipe(
		item.options,
		mapNullable(serializeOperationObject(dereference, pattern, 'OPTIONS', rootName, cwd)),
	);
	return pipe(
		compactNullables([get, post, put, remove, patch, head, options]),
		sequenceEither,
		mapEither(foldSerializedTypes),
	);
};

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
