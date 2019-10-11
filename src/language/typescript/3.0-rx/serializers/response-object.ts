import { OpenAPIV3 } from 'openapi-types';
import * as nullable from '../../../../utils/nullable';
import { SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Dereference, resolveReference } from '../utils';
import { Either } from 'fp-ts/lib/Either';
import { either } from 'fp-ts';
import { addReferenceDependencies } from './reference-object';

export const serializeResponseObject = (code: string, rootName: string, cwd: string, dereference: Dereference) => (
	responseObject: OpenAPIV3.ResponseObject,
): Either<Error, SerializedType> =>
	pipe(
		responseObject.content,
		nullable.chain(content => content['application/json']),
		nullable.chain(media => media.schema),
		either.fromNullable(new Error('Cannot find schema for media object in ResponseObject')),
		either.chain(schema => {
			const resolved = resolveReference(
				dereference,
				schema,
				$ref => new Error(`Unable to resolve "${$ref}" for response "${code}"`),
			);
			return pipe(
				resolved,
				either.map(serializeSchemaObject(rootName, cwd)),
				either.chain(addReferenceDependencies(schema)),
			);
		}),
	);
