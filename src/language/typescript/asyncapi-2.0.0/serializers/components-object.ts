import { addPathParts, fromString, Ref } from '../../../../utils/ref';
import { SchemaObject, SchemaObjectCodec } from '../../../../schema/asyncapi-2.0.0/schema-object';
import { Either, right } from 'fp-ts/lib/Either';
import { FSEntity, file, directory, fragment } from '../../../../utils/fs';
import { context, getTypeName, getFileName, getTypeFileContent } from '../../common/utils';
import { serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option, record } from 'fp-ts';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { reportIfFailed } from '../../../../utils/io-ts';
import { sequenceEither, sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { ComponentsObject } from '../../../../schema/asyncapi-2.0.0/components-object';
import { MessageObject, MessageObjectCodec } from '../../../../schema/asyncapi-2.0.0/message-object';
import { getSerializedRefType } from '../../common/data/serialized-type';
import { makeNormalizedName } from '../../common/normalized-name';

const serializeMessage = (from: Ref, messageObject: MessageObject): Either<Error, FSEntity> => {
	const serialized = ReferenceObjectCodec.is(messageObject.payload)
		? pipe(
				fromString(messageObject.payload.$ref),
				either.map(getSerializedRefType(from)),
		  )
		: serializeSchemaObject(from, messageObject.payload);
	return pipe(
		serialized,
		either.map(serialized => {
			const normalizedName = makeNormalizedName(from.name);
			return file(getFileName(normalizedName), getTypeFileContent(normalizedName, serialized));
		}),
	);
};

const serializeMessages = combineReader(
	context,
	context => (from: Ref, messages: Record<string, ReferenceObject | MessageObject>): Either<Error, FSEntity> =>
		pipe(
			messages,
			record.collect((name, message) => {
				const resolved = ReferenceObjectCodec.is(message)
					? reportIfFailed(MessageObjectCodec.decode(context.resolveRef(message)))
					: right(message);
				const ref = pipe(
					from,
					addPathParts(name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([resolved, ref]) => serializeMessage(ref, resolved)),
				);
			}),
			sequenceEither,
			either.map(fragment),
		),
);

const serializeSchema = (from: Ref, schema: SchemaObject): Either<Error, FSEntity> => {
	const normalizedName = makeNormalizedName(from.name);
	const typeName = getTypeName(normalizedName);
	const serialized = serializeSchemaObject(from, schema, typeName);
	return pipe(
		serialized,
		either.map(serialized => file(getFileName(normalizedName), getTypeFileContent(normalizedName, serialized))),
	);
};

const serializeSchemas = combineReader(
	context,
	e => (from: Ref, schemas: Record<string, ReferenceObject | SchemaObject>): Either<Error, FSEntity> =>
		pipe(
			schemas,
			record.collect((name, schema) => {
				const resolved = ReferenceObjectCodec.is(schema)
					? pipe(
							e.resolveRef(schema),
							SchemaObjectCodec.decode,
							reportIfFailed,
					  )
					: right(schema);
				const ref = pipe(
					from,
					addPathParts(name),
				);
				return pipe(
					sequenceTEither(resolved, ref),
					either.chain(([resolved, ref]) => serializeSchema(ref, resolved)),
				);
			}),
			sequenceEither,
			either.map(fragment),
		),
);

export const serializeComponentsObject = combineReader(
	serializeSchemas,
	serializeMessages,
	(serializeSchemas, serializeMessages) => (
		from: Ref,
		componentsObject: ComponentsObject,
	): Either<Error, FSEntity> => {
		const schemas = pipe(
			componentsObject.schemas,
			option.map(schemas =>
				pipe(
					from,
					addPathParts('schemas'),
					either.chain(ref => serializeSchemas(ref, schemas)),
					either.map(content => directory('schemas', [content])),
				),
			),
		);
		const messages = pipe(
			componentsObject.messages,
			option.map(messages =>
				pipe(
					from,
					addPathParts('messages'),
					either.chain(ref => serializeMessages(ref, messages)),
					either.map(content => directory('messages', [content])),
				),
			),
		);
		return pipe(
			array.compact([schemas, messages]),
			sequenceEither,
			either.map(fragment),
		);
	},
);
