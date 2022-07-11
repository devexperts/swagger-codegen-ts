"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const io_ts_1 = require("../../utils/io-ts");
const info_object_1 = require("./info-object");
const external_documentation_object_1 = require("./external-documentation-object");
const security_requirement_object_1 = require("./security-requirement-object");
const tag_object_1 = require("./tag-object");
const responses_definitions_object_1 = require("./responses-definitions-object");
const security_definitions_object_1 = require("./security-definitions-object");
const definitions_object_1 = require("./definitions-object");
const paths_object_1 = require("./paths-object");
const parameters_definitions_object_1 = require("./parameters-definitions-object");
const io_ts_2 = require("io-ts");
exports.SwaggerObject = io_ts_2.type({
    basePath: io_ts_1.stringOption,
    consumes: io_ts_1.stringArrayOption,
    definitions: optionFromNullable_1.optionFromNullable(definitions_object_1.DefinitionsObject),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObject),
    host: io_ts_1.stringOption,
    info: info_object_1.InfoObject,
    parameters: optionFromNullable_1.optionFromNullable(parameters_definitions_object_1.ParametersDefinitionsObject),
    paths: paths_object_1.PathsObject,
    produces: io_ts_1.stringArrayOption,
    responses: optionFromNullable_1.optionFromNullable(responses_definitions_object_1.ResponsesDefinitionsObject),
    schemes: io_ts_1.stringArrayOption,
    security: optionFromNullable_1.optionFromNullable(io_ts_2.array(security_requirement_object_1.SecurityRequirementObject)),
    securityDefinitions: optionFromNullable_1.optionFromNullable(security_definitions_object_1.SecurityDefinitionsObject),
    swagger: io_ts_2.string,
    tags: optionFromNullable_1.optionFromNullable(io_ts_2.array(tag_object_1.TagObject)),
}, 'SwaggerObject');
