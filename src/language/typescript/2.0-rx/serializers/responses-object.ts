import { ResponsesObject } from '../../../../schema/2.0/responses-object';
import {
	intercalateSerializedTypes,
	serializedType,
	SerializedType,
	uniqSerializedTypesWithoutDependencies,
} from '../../common/data/serialized-type';
import { array } from 'fp-ts/lib/Array';
import { EMPTY_REFS } from '../utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { lookup } from 'fp-ts/lib/Record';
import { chain } from 'fp-ts/lib/Option';
import { serializeOperationResponse } from './response-object';
import { serializedDependency, EMPTY_DEPENDENCIES } from '../../common/data/serialized-dependency';
import { concatIfL } from '../../../../utils/array';
import { SUCCESSFUL_CODES } from '../../common/utils';

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
		return serializedType('void', 'tvoid', [serializedDependency('void as tvoid', 'io-ts')], EMPTY_REFS);
	}
	const combined = intercalateSerializedTypes(
		serializedType('|', ',', EMPTY_DEPENDENCIES, EMPTY_REFS),
		serializedResponses,
	);

	const isUnion = serializedResponses.length > 1;

	return serializedType(
		combined.type,
		isUnion ? `union([${combined.io}])` : combined.io,
		concatIfL(isUnion, combined.dependencies, () => [serializedDependency('union', 'io-ts')]),
		EMPTY_REFS,
	);
};
