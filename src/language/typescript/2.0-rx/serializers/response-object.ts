import { ResponseObject } from '../../../../schema/2.0/response-object';
import { map, Option } from 'fp-ts/lib/Option';
import { SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either } from 'fp-ts/lib/Either';
import { Ref } from '../../../../utils/ref';

export const serializeResponseObject = (from: Ref, response: ResponseObject): Option<Either<Error, SerializedType>> =>
	pipe(
		response.schema,
		map(schema => serializeSchemaObject(from, schema)),
	);
