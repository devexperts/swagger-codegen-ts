"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const paths_object_1 = require("./paths-object");
const components_object_1 = require("./components-object");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
exports.OpenapiObjectCodec = io_ts_1.type({
    openapi: io_ts_1.union([io_ts_1.literal('3.0.0'), io_ts_1.literal('3.0.1'), io_ts_1.literal('3.0.2')], 'OpenapiObject'),
    paths: paths_object_1.PathsObjectCodec,
    components: optionFromNullable_1.optionFromNullable(components_object_1.ComponentsObjectCodec),
}, 'OpenapiObject');
