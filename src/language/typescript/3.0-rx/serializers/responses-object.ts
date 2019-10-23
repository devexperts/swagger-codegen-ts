import {
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
	uniqSerializedTypesWithoutDependencies,
	SERIALIZED_VOID_TYPE,
	getSerializedRefType,
} from '../../common/data/serialized-type';
import { SUCCESSFUL_CODES } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeResponseObject } from './response-object';
import { compactNullables } from '../../../../utils/nullable';
import * as nullable from '../../../../utils/nullable';
import { serializedDependency } from '../../common/data/serialized-dependency';
import { concatIfL } from '../../../../utils/array';
import { sequenceEither } from '../../../../utils/either';
import { array, either } from 'fp-ts';
import { isReferenceObject } from './reference-object';
import { Either, mapLeft } from 'fp-ts/lib/Either';
import { fromString, Ref } from '../../../../utils/ref';
import { ResponsesObject } from '../../../../schema/3.0/responses-object';

export const serializeResponsesObject = (from: Ref) => (
	responsesObject: ResponsesObject,
): Either<Error, SerializedType> => {
	const serializedResponses = pipe(
		SUCCESSFUL_CODES,
		array.map(code =>
			pipe(
				responsesObject[code],
				nullable.map(r =>
					isReferenceObject(r)
						? pipe(
								r.$ref,
								fromString,
								mapLeft(() => new Error(`Invalid ${r.$ref} for ResponsesObject'c code "${code}"`)),
								either.map(getSerializedRefType(from)),
						  )
						: serializeResponseObject(from)(code, r),
				),
			),
		),
		compactNullables,
		sequenceEither,
		either.map(uniqSerializedTypesWithoutDependencies),
	);
	return pipe(
		serializedResponses,
		either.map(serializedResponses => {
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
};
