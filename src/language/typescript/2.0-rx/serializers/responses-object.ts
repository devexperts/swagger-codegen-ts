import { ResponsesObject } from '../../../../schema/2.0/responses-object';
import { intercalateSerializedTypes, serializedType, SerializedType } from '../data/serialized-type';
import { array, uniq } from 'fp-ts/lib/Array';
import { EMPTY_REFS, SUCCESSFUL_CODES } from '../utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { lookup } from 'fp-ts/lib/Record';
import { chain } from 'fp-ts/lib/Option';
import { serializeOperationResponse } from './response-object';
import { dependency, EMPTY_DEPENDENCIES } from '../data/serialized-dependency';
import { Eq, eqString, getStructEq } from 'fp-ts/lib/Eq';
import { concatIfL } from '../../../../utils/array';

const eqSerializedTypeWithoutDependencies: Eq<SerializedType> = getStructEq<Pick<SerializedType, 'type' | 'io'>>({
	type: eqString,
	io: eqString,
});
const uniqSerializedTypesWithoutDependencies = uniq(eqSerializedTypeWithoutDependencies);

export const serializeOperationResponses = (
	responses: ResponsesObject,
	rootName: string,
	cwd: string,
): SerializedType => {
	const serializedResponses = uniqSerializedTypesWithoutDependencies(
		array.compact(
			SUCCESSFUL_CODES.map(code =>
				pipe(
					lookup(code, responses),
					chain(response => serializeOperationResponse(code, response, rootName, cwd)),
				),
			),
		),
	);
	if (serializedResponses.length === 0) {
		return serializedType('void', 'tvoid', [dependency('void as tvoid', 'io-ts')], EMPTY_REFS);
	}
	const combined = intercalateSerializedTypes(
		serializedType('|', ',', EMPTY_DEPENDENCIES, EMPTY_REFS),
		serializedResponses,
	);

	const isUnion = serializedResponses.length > 1;

	return serializedType(
		combined.type,
		isUnion ? `union([${combined.io}])` : combined.io,
		concatIfL(isUnion, combined.dependencies, () => [dependency('union', 'io-ts')]),
		EMPTY_REFS,
	);
};
