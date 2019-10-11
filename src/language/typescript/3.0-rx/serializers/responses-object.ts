import { OpenAPIV3 } from 'openapi-types';
import {
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
	uniqSerializedTypesWithoutDependencies,
} from '../../common/data/serialized-type';
import { SUCCESSFUL_CODES } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeResponseObject } from './response-object';
import { compactNullables } from '../../../../utils/nullable';
import * as nullable from '../../../../utils/nullable';
import { dependency } from '../../common/data/serialized-dependency';
import { concatIfL } from '../../../../utils/array';
import { Dereference, resolveReference } from '../utils';
import { sequenceEither } from '../../../../utils/either';
import { array, either } from 'fp-ts';
import { addReferenceDependencies } from './reference-object';
import { Either } from 'fp-ts/lib/Either';

export const serializeResponsesObject = (rootName: string, cwd: string, dereference: Dereference) => (
	responsesObject: OpenAPIV3.ResponsesObject,
): Either<Error, SerializedType> =>
	pipe(
		SUCCESSFUL_CODES,
		array.map(code =>
			pipe(
				responsesObject[code],
				nullable.map(r => {
					return pipe(
						resolveReference(
							dereference,
							r,
							$ref => new Error(`Unable to resolve ${$ref} for ResponsesObject'c code "${code}"`),
						),
						either.chain(serializeResponseObject(code, rootName, cwd, dereference)),
						either.chain(addReferenceDependencies(r)),
					);
				}),
			),
		),
		compactNullables,
		sequenceEither,
		either.map(uniqSerializedTypesWithoutDependencies),
		either.map(serializedResponses => {
			if (serializedResponses.length === 0) {
				return serializedType('void', 'tvoid', [dependency('void as tvoid', 'io-ts')], []);
			}
			const combined = intercalateSerializedTypes(serializedType('|', ',', [], []), serializedResponses);
			const isUnion = serializedResponses.length > 1;
			return serializedType(
				combined.type,
				isUnion ? `union([${combined.io}])` : combined.io,
				concatIfL(isUnion, combined.dependencies, () => [dependency('union', 'io-ts')]),
				[],
			);
		}),
	);
