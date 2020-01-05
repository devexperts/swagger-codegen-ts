import { ResponsesObject } from '../../../../schema/2.0/responses-object';
import {
	getSerializedRefType,
	intercalateSerializedTypes,
	SERIALIZED_VOID_TYPE,
	serializedType,
	SerializedType,
	uniqSerializedTypesByTypeAndIO,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeResponseObject } from './response-object';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { concatIfL } from '../../../../utils/array';
import { array, either, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';
import { fromString, Ref } from '../../../../utils/ref';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { some } from 'fp-ts/lib/Option';

export const serializeOperationResponses = (from: Ref, responses: ResponsesObject): Either<Error, SerializedType> =>
	pipe(
		responses,
		record.collect((code, response) => {
			if (ReferenceObjectCodec.is(response)) {
				return pipe(fromString(response.$ref), either.map(getSerializedRefType(from)), some);
			} else {
				return serializeResponseObject(from, response);
			}
		}),
		array.compact,
		sequenceEither,
		either.map(responses => {
			const serializedResponses = uniqSerializedTypesByTypeAndIO(responses);
			if (serializedResponses.length === 0) {
				return SERIALIZED_VOID_TYPE;
			}
			const combined = intercalateSerializedTypes(serializedType('|', ',', [], []), serializedResponses);

			const isUnion = serializedResponses.length > 1;

			return serializedType(
				combined.type,
				isUnion ? `union([${combined.io}])` : combined.io,
				concatIfL(isUnion, combined.dependencies, () => [serializedDependency('union', 'io-ts')]),
				[],
			);
		}),
	);
