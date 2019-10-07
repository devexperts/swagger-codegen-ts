import { ResponseObject } from '../../../../schema/2.0/response-object';
import { map, Option } from 'fp-ts/lib/Option';
import { SerializedType } from '../data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';

export const serializeOperationResponse = (
	code: string,
	response: ResponseObject,
	rootName: string,
	cwd: string,
): Option<SerializedType> =>
	pipe(
		response.schema,
		map(schema => serializeSchemaObject(schema, rootName, cwd)),
	);
