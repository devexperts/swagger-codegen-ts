import { SerializedType, getSerializedRefType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSchemaObject } from './schema-object';
import { Either } from 'fp-ts/lib/Either';
import { fromString, Ref } from '../../../../utils/ref';
import { either, option } from 'fp-ts';
import { ResponseObject } from '../../../../schema/3.0/response-object';
import { Option } from 'fp-ts/lib/Option';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { getKeyMatchValue } from '../../common/utils';

const requestMediaRegexp = /^(video|audio|image|application|text)/;

export const serializeResponseObject = (
	from: Ref,
	responseObject: ResponseObject,
): Option<Either<Error, SerializedType>> =>
	pipe(
		responseObject.content,
		option.chain(content => getKeyMatchValue(content, requestMediaRegexp)),
		option.chain(media => media.schema),
		option.map(schema =>
			ReferenceObjectCodec.is(schema)
				? pipe(fromString(schema.$ref), either.map(getSerializedRefType(from)))
				: serializeSchemaObject(from)(schema),
		),
	);
