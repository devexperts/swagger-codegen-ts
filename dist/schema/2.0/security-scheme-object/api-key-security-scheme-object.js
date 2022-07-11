"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_security_scheme_object_1 = require("./base-security-scheme-object");
const io_ts_1 = require("io-ts");
exports.ApiKeySecuritySchemeObject = io_ts_1.type(Object.assign(Object.assign({}, base_security_scheme_object_1.BaseSecuritySchemeObjectProps), { type: io_ts_1.literal('apiKey'), in: io_ts_1.union([io_ts_1.literal('query'), io_ts_1.literal('header')]), name: io_ts_1.string }), 'ApiKeySecuritySchemeObject');
