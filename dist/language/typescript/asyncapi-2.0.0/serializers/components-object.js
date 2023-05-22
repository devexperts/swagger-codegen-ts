"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("../../../../utils/ref");
const schema_object_1 = require("../../../../schema/asyncapi-2.0.0/schema-object");
const Either_1 = require("fp-ts/lib/Either");
const fs_1 = require("../../../../utils/fs");
const utils_1 = require("../../common/utils");
const schema_object_2 = require("./schema-object");
const serialized_dependency_1 = require("../../common/data/serialized-dependency");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const reference_object_1 = require("../../../../schema/asyncapi-2.0.0/reference-object");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const message_object_1 = require("../../../../schema/asyncapi-2.0.0/message-object");
const serialized_type_1 = require("../../common/data/serialized-type");
const serializeMessage = (from, messageObject) => {
    const typeName = utils_1.getTypeName(from.name);
    const ioName = utils_1.getIOName(from.name);
    const serialized = reference_object_1.ReferenceObjectCodec.is(messageObject.payload)
        ? pipeable_1.pipe(ref_1.fromString(messageObject.payload.$ref), fp_ts_1.either.map(serialized_type_1.getSerializedRefType(from)))
        : schema_object_2.serializeSchemaObject(from, messageObject.payload);
    return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized => fs_1.file(`${from.name}.ts`, `
					${serialized_dependency_1.serializeDependencies(serialized.dependencies)}

					export type ${typeName} = ${serialized.type};
					export const ${ioName} = ${serialized.io};
				`)));
};
const serializeMessages = reader_utils_1.combineReader(utils_1.context, context => (from, messages) => pipeable_1.pipe(messages, fp_ts_1.record.collect((name, message) => {
    const resolved = reference_object_1.ReferenceObjectCodec.is(message)
        ? context.resolveRef(message.$ref, message_object_1.MessageObjectCodec)
        : Either_1.right(message);
    const ref = pipeable_1.pipe(from, ref_1.addPathParts(name));
    return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([resolved, ref]) => serializeMessage(ref, resolved)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(fs_1.fragment)));
const serializeSchema = (from, schema) => {
    const typeName = utils_1.getTypeName(from.name);
    const ioName = utils_1.getIOName(from.name);
    const serialized = schema_object_2.serializeSchemaObject(from, schema, typeName);
    return pipeable_1.pipe(serialized, fp_ts_1.either.map(serialized => {
        const dependencies = serialized_dependency_1.serializeDependencies(serialized.dependencies);
        return fs_1.file(`${from.name}.ts`, `
					${dependencies}

					export type ${typeName} = ${serialized.type};
					export const ${ioName} = ${serialized.io};
				`);
    }));
};
const serializeSchemas = reader_utils_1.combineReader(utils_1.context, e => (from, schemas) => pipeable_1.pipe(schemas, fp_ts_1.record.collect((name, schema) => {
    const resolved = reference_object_1.ReferenceObjectCodec.is(schema)
        ? e.resolveRef(schema.$ref, schema_object_1.SchemaObjectCodec)
        : Either_1.right(schema);
    const ref = pipeable_1.pipe(from, ref_1.addPathParts(name));
    return pipeable_1.pipe(either_utils_1.sequenceTEither(resolved, ref), fp_ts_1.either.chain(([resolved, ref]) => serializeSchema(ref, resolved)));
}), either_utils_1.sequenceEither, fp_ts_1.either.map(fs_1.fragment)));
exports.serializeComponentsObject = reader_utils_1.combineReader(serializeSchemas, serializeMessages, (serializeSchemas, serializeMessages) => (from, componentsObject) => {
    const schemas = pipeable_1.pipe(componentsObject.schemas, fp_ts_1.option.map(schemas => pipeable_1.pipe(from, ref_1.addPathParts('schemas'), fp_ts_1.either.chain(ref => serializeSchemas(ref, schemas)), fp_ts_1.either.map(content => fs_1.directory('schemas', [content])))));
    const messages = pipeable_1.pipe(componentsObject.messages, fp_ts_1.option.map(messages => pipeable_1.pipe(from, ref_1.addPathParts('messages'), fp_ts_1.either.chain(ref => serializeMessages(ref, messages)), fp_ts_1.either.map(content => fs_1.directory('messages', [content])))));
    return pipeable_1.pipe(fp_ts_1.array.compact([schemas, messages]), either_utils_1.sequenceEither, fp_ts_1.either.map(fs_1.fragment));
});
