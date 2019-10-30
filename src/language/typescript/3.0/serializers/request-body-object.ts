import { serializeSchemaObject } from './schema-object';
import { getSerializedRefType, SerializedType } from '../../common/data/serialized-type';
import { Either, mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { fromString, Ref } from '../../../../utils/ref';
import { RequestBodyObject } from '../../../../schema/3.0/request-body-object';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { SchemaObject } from '../../../../schema/3.0/schema-object';
import { ReferenceObject } from '../../../../schema/2.0/reference-object';

export const serializeRequestBodyObject = (from: Ref, body: RequestBodyObject): Either<Error, SerializedType> =>
	pipe(
		getSchema(body),
		either.chain(schema =>
			ReferenceObjectCodec.is(schema)
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

const getSchema = (requestBodyObject: RequestBodyObject): Either<Error, ReferenceObject | SchemaObject> =>
	pipe(
		record.lookup('application/json', requestBodyObject.content),
		option.chain(media => media.schema),
		either.fromOption(() => new Error('No schema found for ReqeustBodyObject')),
	);
