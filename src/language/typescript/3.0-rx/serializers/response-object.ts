import { OpenAPIV3 } from 'openapi-types';
import * as nullable from '../../../../utils/nullable';
import { SerializedType, SERIALIZED_VOID_TYPE, getSerializedRefType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either, mapLeft, right } from 'fp-ts/lib/Either';
import { isReferenceObject } from './reference-object';
import { fromString } from '../../../../utils/ref';
import { either } from 'fp-ts';

export const serializeResponseObject = (
	code: string,
	cwd: string,
	responseObject: OpenAPIV3.ResponseObject,
): Either<Error, SerializedType> =>
	pipe(
		responseObject.content,
		nullable.chain(content => content['application/json']),
		nullable.chain(media => media.schema),
		nullable.fold(
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
							either.map(getSerializedRefType(cwd)),
					  )
					: serializeSchemaObject(cwd)(schema),
		),
	);
