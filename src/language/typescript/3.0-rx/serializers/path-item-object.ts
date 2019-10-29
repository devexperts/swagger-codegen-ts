import { flatten } from 'fp-ts/lib/Array';
import { uniqString } from '../../../../utils/array';
import { foldSerializedTypes, SerializedType } from '../../common/data/serialized-type';
import { serializeOperationObject } from './operation-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { Either } from 'fp-ts/lib/Either';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { Ref } from '../../../../utils/ref';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
import { Option } from 'fp-ts/lib/Option';
import { Kind } from '../../../../utils/types';

export const serializePathItemObject = combineReader(
	serializeOperationObject,
	serializeOperationObject => (
		pattern: string,
		item: PathItemObject,
		from: Ref,
		kind: Kind,
	): Either<Error, SerializedType> => {
		const get = pipe(
			item.get,
			option.map(serializeOperationObject(pattern, 'GET', from, kind)),
		);
		const post = pipe(
			item.post,
			option.map(serializeOperationObject(pattern, 'POST', from, kind)),
		);
		const put = pipe(
			item.put,
			option.map(serializeOperationObject(pattern, 'PUT', from, kind)),
		);
		const remove = pipe(
			item.delete,
			option.map(serializeOperationObject(pattern, 'DELETE', from, kind)),
		);
		const patch = pipe(
			item.patch,
			option.map(serializeOperationObject(pattern, 'PATCH', from, kind)),
		);
		const head = pipe(
			item.head,
			option.map(serializeOperationObject(pattern, 'HEAD', from, kind)),
		);
		const options = pipe(
			item.options,
			option.map(serializeOperationObject(pattern, 'OPTIONS', from, kind)),
		);
		return pipe(
			array.compact([get, post, put, remove, patch, head, options]),
			sequenceEither,
			either.map(foldSerializedTypes),
		);
	},
);

export const serializePathItemObjectTags = (pathItemObject: PathItemObject): Option<string> => {
	const operations = [
		pathItemObject.get,
		pathItemObject.post,
		pathItemObject.put,
		pathItemObject.delete,
		pathItemObject.options,
		pathItemObject.head,
		pathItemObject.patch,
		pathItemObject.trace,
	];
	return pipe(
		nonEmptyArray.fromArray(array.compact(operations)),
		option.map(operations => uniqString(flatten(array.compact(operations.map(operation => operation.tags))))),
		option.chain(nonEmptyArray.fromArray),
		option.map(tags => tags.join('').replace(/\s/g, '')),
	);
};
