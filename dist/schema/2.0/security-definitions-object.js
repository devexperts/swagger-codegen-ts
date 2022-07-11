"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_scheme_object_1 = require("./security-scheme-object/security-scheme-object");
const io_ts_1 = require("../../utils/io-ts");
exports.SecurityDefinitionsObject = io_ts_1.dictionary(security_scheme_object_1.SecuritySchemeObject, 'SecurityDefinitionsObject');
