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
			option.map(operation => serializeOperationObject(pattern, 'GET', from, kind, operation, item)),
		);
		const post = pipe(
			item.post,
			option.map(operation => serializeOperationObject(pattern, 'POST', from, kind, operation, item)),
		);
		const put = pipe(
			item.put,
			option.map(operation => serializeOperationObject(pattern, 'PUT', from, kind, operation, item)),
		);
		const remove = pipe(
			item.delete,
			option.map(operation => serializeOperationObject(pattern, 'DELETE', from, kind, operation, item)),
		);
		const patch = pipe(
			item.patch,
			option.map(operation => serializeOperationObject(pattern, 'PATCH', from, kind, operation, item)),
		);
		const head = pipe(
			item.head,
			option.map(operation => serializeOperationObject(pattern, 'HEAD', from, kind, operation, item)),
		);
		const options = pipe(
			item.options,
			option.map(operation => serializeOperationObject(pattern, 'OPTIONS', from, kind, operation, item)),
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
