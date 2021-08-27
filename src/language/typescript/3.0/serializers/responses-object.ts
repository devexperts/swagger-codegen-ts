import {
	getSerializedRefType,
	SERIALIZED_VOID_TYPE,
	uniqSerializedTypesByTypeAndIO,
	serializedType,
	intercalateSerializedTypes,
} from '../../common/data/serialized-type';
import { DEFAULT_MEDIA_TYPE, SUCCESSFUL_CODES } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { SerializedResponse, serializeResponseObjectWithMediaType } from './response-object';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { array, either, option, record } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { fromString, Ref } from '../../../../utils/ref';
import { ResponsesObject } from '../../../../schema/3.0/responses-object';
import { flow } from 'fp-ts/lib/function';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { some } from 'fp-ts/lib/Option';
import { eqString } from 'fp-ts/lib/Eq';
import { serializedDependency } from '../../common/data/serialized-dependency';

const concatNonUniqResonses = (responses: SerializedResponse[]): SerializedResponse[] =>
	pipe(
		responses,
		array.map(({ mediaType }) => mediaType),
		array.uniq(eqString),
		array.map(mediaType => {
			const schemes = pipe(
				responses,
				array.filter(a => a.mediaType === mediaType),
				array.map(a => a.schema),
				uniqSerializedTypesByTypeAndIO,
			);
			if (schemes.length > 1) {
				const combined = intercalateSerializedTypes(serializedType('|', ',', [], []), schemes);
				const scheme = serializedType(
					combined.type,
					`union([${combined.io}])`,
					combined.dependencies.concat([serializedDependency('union', 'io-ts')]),
					[],
				);
				return { mediaType, schema: scheme };
			}
			return { mediaType, schema: schemes[0] };
		}),
	);

export const serializeResponsesObject = (from: Ref) => (
	responsesObject: ResponsesObject,
): Either<Error, Either<SerializedResponse, SerializedResponse[]>> => {
	const serializedResponses = pipe(
		SUCCESSFUL_CODES,
		array.map(code =>
			pipe(
				record.lookup(code, responsesObject),
				option.chain(r =>
					ReferenceObjectCodec.is(r)
						? pipe(
								fromString(r.$ref),
								either.mapLeft(
									() => new Error(`Invalid ${r.$ref} for ResponsesObject'c code "${code}"`),
								),
								either.map(getSerializedRefType(from)),
								either.map(type => [{ mediaType: DEFAULT_MEDIA_TYPE, schema: type }]),
								some,
						  )
						: serializeResponseObjectWithMediaType(from, r),
				),
			),
		),
		array.compact,
		sequenceEither,
		either.map(flow(array.flatten, concatNonUniqResonses)),
	);
	return pipe(
		serializedResponses,
		either.map(serializedResponses => {
			if (serializedResponses.length === 0) {
				return either.left({ mediaType: DEFAULT_MEDIA_TYPE, schema: SERIALIZED_VOID_TYPE });
			} else if (serializedResponses.length === 1) {
				return either.left(serializedResponses[0]);
			} else {
				return either.right(serializedResponses);
			}
		}),
	);
};
