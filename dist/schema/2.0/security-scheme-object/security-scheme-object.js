"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basic_security_scheme_object_1 = require("./basic-security-scheme-object");
const api_key_security_scheme_object_1 = require("./api-key-security-scheme-object");
const oauth2_security_scheme_object_1 = require("./oauth2-security-scheme-object");
const io_ts_1 = require("io-ts");
exports.SecuritySchemeObject = io_ts_1.union([basic_security_scheme_object_1.BasicSecuritySchemeObject, api_key_security_scheme_object_1.ApiKeySecuritySchemeObject, oauth2_security_scheme_object_1.OAuth2SecuritySchemeObject], 'SecuritySchemeObject');
