"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const implicit_oauth2_security_scheme_object_1 = require("./implicit-oauth2-security-scheme-object");
const password_oauth2_security_scheme_object_1 = require("./password-oauth2-security-scheme-object");
const application_oauth2_security_scheme_object_1 = require("./application-oauth2-security-scheme-object");
const access_code_oauth2_security_scheme_object_1 = require("./access-code-oauth2-security-scheme-object");
const io_ts_1 = require("io-ts");
exports.OAuth2SecuritySchemeObject = io_ts_1.union([
    implicit_oauth2_security_scheme_object_1.ImplicitOAuth2SecuritySchemeObject,
    password_oauth2_security_scheme_object_1.PasswordOAuth2SecuritySchemeObject,
    application_oauth2_security_scheme_object_1.ApplicationOAuth2SecuritySchemeObject,
    access_code_oauth2_security_scheme_object_1.AccessCodeOAuth2SecuritySchemeObject,
], 'OAuth2SecuritySchemeObject');
