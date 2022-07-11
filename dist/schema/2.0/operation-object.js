"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const external_documentation_object_1 = require("./external-documentation-object");
const parameter_object_1 = require("./parameter-object");
const reference_object_1 = require("./reference-object");
const responses_object_1 = require("./responses-object");
const security_requirement_object_1 = require("./security-requirement-object");
const io_ts_1 = require("../../utils/io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const io_ts_2 = require("io-ts");
exports.OperationObject = io_ts_2.type({
    tags: io_ts_1.stringArrayOption,
    summary: io_ts_1.stringOption,
    description: io_ts_1.stringOption,
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObject),
    operationId: io_ts_1.stringOption,
    consumes: io_ts_1.stringArrayOption,
    produces: io_ts_1.stringArrayOption,
    parameters: optionFromNullable_1.optionFromNullable(io_ts_2.array(io_ts_2.union([reference_object_1.ReferenceObjectCodec, parameter_object_1.ParameterObjectCodec]))),
    responses: responses_object_1.ResponsesObject,
    schemes: io_ts_1.stringArrayOption,
    deprecated: io_ts_1.booleanOption,
    security: optionFromNullable_1.optionFromNullable(io_ts_2.array(security_requirement_object_1.SecurityRequirementObject)),
}, 'OperationObject');
