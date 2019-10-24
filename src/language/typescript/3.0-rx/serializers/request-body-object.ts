import { serializeSchemaObject } from './schema-object';
import { getSerializedRefType, SerializedType } from '../../common/data/serialized-type';
import { Either, mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { isReferenceObject } from './reference-object';
import { either, record } from 'fp-ts';
import { fromString, Ref } from '../../../../utils/ref';
import { RequestBodyObject } from '../../../../schema/3.0/request-body-object';

export const serializeRequestBodyObject = (from: Ref) => (body: RequestBodyObject): Either<Error, SerializedType> => {
	return pipe(
		record.lookup('application/json', body.content),
		either.fromOption(() => new Error(`RequestBodyObject.content should container "application/json" section`)),
		either.map(media => media.schema),
		either.chain(either.fromOption(() => new Error('RequestBodyObject.content should container schema'))),
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
