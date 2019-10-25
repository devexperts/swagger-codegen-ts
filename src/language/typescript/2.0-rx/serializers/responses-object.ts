import { ResponsesObject } from '../../../../schema/2.0/responses-object';
import {
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
	uniqSerializedTypesWithoutDependencies,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeOperationResponse } from './response-object';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { concatIfL } from '../../../../utils/array';
import { SUCCESSFUL_CODES } from '../../common/utils';
import { array, either, option, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';

export const serializeOperationResponses = (
	responses: ResponsesObject,
	rootName: string,
	cwd: string,
): Either<Error, SerializedType> =>
	pipe(
		SUCCESSFUL_CODES,
		array.map(code =>
			pipe(
				record.lookup(code, responses),
				option.chain(response => serializeOperationResponse(code, response, rootName, cwd)),
			),
		),
		array.compact,
		sequenceEither,
		either.map(responses => {
			const serializedResponses = uniqSerializedTypesWithoutDependencies(responses);
			if (serializedResponses.length === 0) {
				return serializedType('void', 'tvoid', [serializedDependency('void as tvoid', 'io-ts')], []);
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
