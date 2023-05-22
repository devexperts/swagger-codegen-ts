import {
	getSerializedBlobType,
	getSerializedRefType,
	SERIALIZED_STRING_TYPE,
	SerializedType,
} from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either } from 'fp-ts/lib/Either';
import { fromString, Ref } from '../../../../utils/ref';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { ResponseObject } from '../../../../schema/3.0/response-object';
import { Option } from 'fp-ts/lib/Option';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { getKeyMatchValue, getKeyMatchValues, getResponseTypeFromMediaType, XHRResponseType } from '../../common/utils';
import { SchemaObject } from '../../../../schema/3.0/schema-object';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';

const requestMediaRegexp = /^(video|audio|image|application|text|\*)\/(\w+|\*)/;

export type SerializedResponse = { mediaType: string; schema: SerializedType };

const serializeResponseSchema = combineReader(
	serializeSchemaObject,
	serializeSchemaObject => (
		responseType: XHRResponseType,
		schema: ReferenceObject | SchemaObject,
		from: Ref,
	): Either<Error, SerializedType> => {
		switch (responseType) {
			case 'json':
				return ReferenceObjectCodec.is(schema)
					? pipe(fromString(schema.$ref), either.map(getSerializedRefType(from)))
					: serializeSchemaObject(from)(schema);
			case 'text':
				return either.right(SERIALIZED_STRING_TYPE);
			case 'blob':
				return getSerializedBlobType(from);
		}
	},
);

export const serializeResponseObject = combineReader(
	serializeSchemaObject,
	serializeResponseSchema,
	(serializeSchemaObject, serializeResponseSchema) => (
		from: Ref,
		responseObject: ResponseObject,
	): Option<Either<Error, SerializedType>> =>
		pipe(
			responseObject.content,
			option.chain(content => getKeyMatchValue(content, requestMediaRegexp)),
			option.chain(({ key: mediaType, value: { schema } }) =>
				pipe(
					schema,
					option.map(schema => ({ mediaType, schema })),
				),
			),
			option.map(({ mediaType, schema }) => {
				const resType = getResponseTypeFromMediaType(mediaType);
				return serializeResponseSchema(resType, schema, from);
			}),
		),
);

export const serializeResponseObjectWithMediaType = combineReader(
	serializeResponseSchema,
	serializeResponseSchema => (
		from: Ref,
		responseObject: ResponseObject,
	): Option<Either<Error, SerializedResponse[]>> =>
		pipe(
			responseObject.content,
			option.chain(content => getKeyMatchValues(content, requestMediaRegexp)),
			option.chain(arr =>
				pipe(
					arr,
					array.map(({ key: mediaType, value: { schema } }) =>
						pipe(
							schema,
							option.map(schema => ({ mediaType, schema })),
						),
					),
					array.filterMap(a => a),
					nonEmptyArray.fromArray,
				),
			),
			option.map(arr =>
				pipe(
					arr,
					array.map(({ mediaType, schema }) => {
						const resType = getResponseTypeFromMediaType(mediaType);
						return pipe(
							serializeResponseSchema(resType, schema, from),
							either.map(schema => ({
								mediaType,
								schema,
							})),
						);
					}),
					sequenceEither,
				),
			),
		),
);
