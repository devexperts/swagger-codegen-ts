import { ResponseObject } from '../../../../schema/2.0/response-object';
import { SerializedType, SERIALIZED_VOID_TYPE } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either, right } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';
import { option } from 'fp-ts';

export const serializeResponseObject = (from: Ref, response: ResponseObject): Either<Error, SerializedType> =>
	pipe(
		response.schema,
		option.fold(
			() => right(SERIALIZED_VOID_TYPE),
			schema => serializeSchemaObject(from, schema),
		),
	);
