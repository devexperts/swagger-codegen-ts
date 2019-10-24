import { SerializedType, SERIALIZED_VOID_TYPE, getSerializedRefType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either, mapLeft, right } from 'fp-ts/lib/Either';
import { isReferenceObject } from './reference-object';
import { fromString, Ref } from '../../../../utils/ref';
import { either, option } from 'fp-ts';
import { ResponseObject } from '../../../../schema/3.0/response-object';

export const serializeResponseObject = (from: Ref) => (
	code: string,
	responseObject: ResponseObject,
): Either<Error, SerializedType> =>
	pipe(
		responseObject.content,
		option.mapNullable(content => content['application/json']),
		option.chain(media => media.schema),
		option.fold(
			() => right(SERIALIZED_VOID_TYPE),
			schema =>
				isReferenceObject(schema)
					? pipe(
							schema.$ref,
							fromString,
							mapLeft(
								() =>
									new Error(
										`Invalid MediaObject.content.$ref "${
											schema.$ref
										}" for ResponseObject with code ${code}`,
									),
							),
							either.map(getSerializedRefType(from)),
					  )
					: serializeSchemaObject(from)(schema),
		),
	);
