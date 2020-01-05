import { fromString, Ref } from '../../../../utils/ref';
import { MessageObject } from '../../../../schema/asyncapi-2.0.0/message-object';
import { Either } from 'fp-ts/lib/Either';
import { getSerializedRefType, SerializedType } from '../../common/data/serialized-type';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { serializeSchemaObject } from './schema-object';

export const serializeMessageObject = (from: Ref, messageObject: MessageObject): Either<Error, SerializedType> =>
	ReferenceObjectCodec.is(messageObject.payload)
		? pipe(fromString(messageObject.payload.$ref), either.map(getSerializedRefType(from)))
		: serializeSchemaObject(from, messageObject.payload);
