"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_security_scheme_object_1 = require("./base-security-scheme-object");
const scopes_object_1 = require("../scopes-object");
const io_ts_1 = require("io-ts");
exports.ImplicitOAuth2SecuritySchemeObject = io_ts_1.type(Object.assign(Object.assign({}, base_security_scheme_object_1.BaseSecuritySchemeObjectProps), { type: io_ts_1.literal('oauth2'), flow: io_ts_1.literal('implicit'), authorizationUrl: io_ts_1.string, scopes: scopes_object_1.ScopesObject }), 'ImplicitOAuth2SecuritySchemeObject');
