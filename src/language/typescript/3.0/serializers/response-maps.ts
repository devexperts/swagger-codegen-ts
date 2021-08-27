import { array, either, option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { getOperationName } from './operation-object';
import { serializeResponsesObject } from './responses-object';
import { HTTPMethod } from '../../common/utils';
import { foldSerializedTypes, serializedType, SerializedType } from '../../common/data/serialized-type';
import { Ref } from '../../../../utils/ref';
import { PathItemObject } from '../../../../schema/3.0/path-item-object';
import { OperationObject } from '../../../../schema/3.0/operation-object';

const serializeResponseMap = (
	pattern: string,
	method: HTTPMethod,
	from: Ref,
	operation: OperationObject,
): Either<Error, SerializedType> => {
	const operationName = getOperationName(pattern, operation, method);
	const serializedResponses = serializeResponsesObject(from)(operation.responses);
	return pipe(
		serializedResponses,
		either.map(
			flow(
				either.fold(
					() => serializedType('', '', [], []),
					sr => {
						const rows = sr.map(s => `'${s.mediaType}': ${s.schema.type};`);
						const type = `type MapToResponse${operationName} = {${rows.join('')}};`;
						return serializedType(type, '', [], []); // dependecies in serializeOperationObject serializedResponses
					},
				),
			),
		),
	);
};

export const serializeResponseMaps = (
	pattern: string,
	item: PathItemObject,
	from: Ref,
): Either<Error, SerializedType> => {
	const methods: [HTTPMethod, Option<OperationObject>][] = [
		['GET', item.get],
		['POST', item.post],
		['PUT', item.put],
		['DELETE', item.delete],
		['PATCH', item.patch],
		['HEAD', item.head],
		['OPTIONS', item.options],
	];

	return pipe(
		methods,
		array.map(([method, opObject]) =>
			pipe(
				opObject,
				option.map(operation => serializeResponseMap(pattern, method, from, operation)),
			),
		),
		array.compact,
		sequenceEither,
		either.map(foldSerializedTypes),
	);
};
