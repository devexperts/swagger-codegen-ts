"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reference_object_1 = require("./reference-object");
const schema_object_1 = require("./schema-object");
const message_object_1 = require("./message-object");
const parameters_object_1 = require("./parameters-object");
const correlation_id_object_1 = require("./correlation-id-object");
const operation_trait_object_1 = require("./operation-trait-object");
const message_trait_object_1 = require("./message-trait-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const security_scheme_object_1 = require("./security-scheme-object");
const pattern = /^[a-zA-Z0-9.\-_]+$/;
const ComponentsObjectFieldPatternCodec = io_ts_1.brand(io_ts_1.string, (s) => pattern.test(s), 'ComponentsObjectFieldPattern');
exports.ComponentsObjectCodec = io_ts_1.type({
    schemas: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, schema_object_1.SchemaObjectCodec]))),
    messages: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, message_object_1.MessageObjectCodec]))),
    securitySchemes: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, security_scheme_object_1.SecuritySchemeObjectCodec]))),
    parameters: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, parameters_object_1.ParametersObjectCodec]))),
    correlationIds: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, correlation_id_object_1.CorrelationIdObjectCodec]))),
    operationTraits: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, operation_trait_object_1.OperationTraitObjectCodec]))),
    messageTraits: optionFromNullable_1.optionFromNullable(io_ts_1.record(ComponentsObjectFieldPatternCodec, io_ts_1.union([reference_object_1.ReferenceObjectCodec, message_trait_object_1.MessageTraitObjectCodec]))),
}, 'ComponentsObjectCodec');
