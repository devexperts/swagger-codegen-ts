import { serializeSchemaObject } from './schema-object';
import { OpenAPIV3 } from 'openapi-types';
import { getSerializedRefType, SerializedType } from '../../common/data/serialized-type';
import { Either, mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { isReferenceObject } from './reference-object';
import { fromNullable } from '../../../../utils/either';
import { either } from 'fp-ts';
import { fromString, Ref, Refs } from '../../../../utils/ref';

export const serializeRequestBodyObject = (from: Ref) => (
	body: OpenAPIV3.RequestBodyObject,
): Either<Error, SerializedType> => {
	return pipe(
		body.content['application/json'],
		fromNullable(() => new Error(`RequestBodyObject.content should container "application/json" section`)),
		either.map(media => media.schema),
		either.chain(fromNullable(() => new Error('RequestBodyObject.content should container schema'))),
		either.chain(schema =>
			isReferenceObject(schema)
				? pipe(
						schema.$ref,
						fromString,
						mapLeft(
							() => new Error(`Invalid MediaObject.content.$ref "${schema.$ref}" for RequestBodyObject`),
						),
						either.map(getSerializedRefType(from)),
				  )
				: serializeSchemaObject(from)(schema),
		),
	);
};
