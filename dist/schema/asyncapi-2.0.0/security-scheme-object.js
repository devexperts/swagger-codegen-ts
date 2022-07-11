"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const BaseSecuritySchemeObjectCodec = io_ts_1.type({
    description: optionFromNullable_1.optionFromNullable(io_ts_1.string),
});
exports.UserPasswordSecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('userPassword'),
    }),
], 'UserPasswordSecuritySchemeObject');
exports.APIKeySecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('apiKey'),
    }),
]);
exports.X509SecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('X509'),
    }),
]);
exports.SymmetricEncryptionSecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('symmetricEncryption'),
    }),
]);
exports.AssymmetricEncryptionSecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('asymmetricEncryption'),
    }),
]);
exports.HTTPAPIKeySecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('httpApiKey'),
    }),
]);
exports.HTTPSecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('http'),
    }),
]);
exports.OAuth2SecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('oauth2'),
    }),
]);
exports.OpenIdConnectSecuritySchemeObjectCodec = io_ts_1.intersection([
    BaseSecuritySchemeObjectCodec,
    io_ts_1.type({
        type: io_ts_1.literal('openIdConnect'),
    }),
]);
exports.SecuritySchemeObjectCodec = io_ts_1.union([
    exports.UserPasswordSecuritySchemeObjectCodec,
    exports.APIKeySecuritySchemeObjectCodec,
    exports.X509SecuritySchemeObjectCodec,
    exports.SymmetricEncryptionSecuritySchemeObjectCodec,
    exports.AssymmetricEncryptionSecuritySchemeObjectCodec,
    exports.HTTPAPIKeySecuritySchemeObjectCodec,
    exports.OAuth2SecuritySchemeObjectCodec,
    exports.OpenIdConnectSecuritySchemeObjectCodec,
], 'SecuritySchemeObjectCodec');
