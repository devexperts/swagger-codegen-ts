import { addPathParts, fromString, Ref } from '../../../../utils/ref';
import { SchemaObject, SchemaObjectCodec } from '../../../../schema/asyncapi-2.0.0/schema-object';
import { Either, right } from 'fp-ts/lib/Either';
import { FSEntity, file, directory, fragment } from '../../../../utils/fs';
import { context, getIOName, getTypeName } from '../../common/utils';
import { serializeSchemaObject } from './schema-object';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, option, record } from 'fp-ts';
import { ReferenceObject, ReferenceObjectCodec } from '../../../../schema/asyncapi-2.0.0/reference-object';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { sequenceEither, sequenceTEither } from '@devexperts/utils/dist/adt/either.utils';
import { ComponentsObject } from '../../../../schema/asyncapi-2.0.0/components-object';
import { MessageObject, MessageObjectCodec } from '../../../../schema/asyncapi-2.0.0/message-object';
import { getSerializedRefType } from '../../common/data/serialized-type';

const serializeMessage = (from: Ref, messageObject: MessageObject): Either<Error, FSEntity> => {
	const typeName = getTypeName(from.name);
	const ioName = getIOName(from.name);
	const serialized = ReferenceObjectCodec.is(messageObject.payload)
		? pipe(
				fromString(messageObject.payload.$ref),
				either.map(getSerializedRefType(from)),
		  )
		: serializeSchemaObject(from, messageObject.payload);
	return pipe(
		serialized,
		either.map(serialized =>
			file(
				`${from.name}.ts`,
				`
					${serializeDependencies(serialized.dependencies)}

					export type ${typeName} = ${serialized.type};
					export const ${ioName} = ${serialized.io};
				`,
			),
		),
	);
};

const serializeMessages = combineReader(
	context,
	context => (from: Ref, messages: Record<string, ReferenceObject | MessageObject>): Either<Error, FSEntity> =>
		pipe(
			messages,
			record.collect((name, message) => {
				const resolved = ReferenceObjectCodec.is(message)
					? context.resolveRef(message.$ref, MessageObjectCodec)
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
	const typeName = getTypeName(from.name);
	const ioName = getIOName(from.name);
	const serialized = serializeSchemaObject(from, schema, typeName);
	return pipe(
		serialized,
		either.map(serialized => {
			const dependencies = serializeDependencies(serialized.dependencies);

			return file(
				`${from.name}.ts`,
				`
					${dependencies}

					export type ${typeName} = ${serialized.type};
					export const ${ioName} = ${serialized.io};
				`,
			);
		}),
	);
};

const serializeSchemas = combineReader(
	context,
	e => (from: Ref, schemas: Record<string, ReferenceObject | SchemaObject>): Either<Error, FSEntity> =>
		pipe(
			schemas,
			record.collect((name, schema) => {
				const resolved = ReferenceObjectCodec.is(schema)
					? e.resolveRef(schema.$ref, SchemaObjectCodec)
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
