import { OpenAPIV3 } from 'openapi-types';
import * as nullable from '../../../../utils/nullable';
import { SerializedType, SERIALIZED_VOID_TYPE } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either, right } from 'fp-ts/lib/Either';
import { isReferenceObject, serializeReferenceObject } from './reference-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { fromNullable } from '../../../../utils/either';

export const serializeResponseObject = combineReader(
	serializeSchemaObject,
	serializeReferenceObject,
	(serializeSchemaObject, serializeReferenceObject) => (
		code: string,
		rootName: string,
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
								schema,
								serializeReferenceObject(cwd),
								fromNullable(
									() =>
										new Error(
											`Unable to resolve MediaObject.content.$ref "${
												schema.$ref
											}" for ResponseObject with code ${code}`,
										),
								),
						  )
						: serializeSchemaObject(rootName, cwd)(schema),
			),
		),
);
