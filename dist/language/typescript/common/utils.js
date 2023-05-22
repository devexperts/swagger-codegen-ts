"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("../../../utils/string");
const ref_1 = require("../../../utils/ref");
const Reader_1 = require("fp-ts/lib/Reader");
const pipeable_1 = require("fp-ts/lib/pipeable");
const Record_1 = require("fp-ts/lib/Record");
const fp_ts_1 = require("fp-ts");
exports.SUCCESSFUL_CODES = ['200', '201', 'default'];
exports.CONTROLLERS_DIRECTORY = 'controllers';
exports.DEFINITIONS_DIRECTORY = 'definitions';
const INVALID_NAMES = ['Error', 'Promise', 'PromiseLike', 'Array', 'ArrayLike', 'Function', 'Object'];
const TYPE_NAME_NORMALIZE_REGEX = /\W/g;
const normalize = (name) => name.replace(TYPE_NAME_NORMALIZE_REGEX, '_').replace(/^(\d)/, '_$1');
exports.getTypeName = (name) => {
    if (name.length === 0) {
        return 'Type';
    }
    const normalized = normalize(name);
    return INVALID_NAMES.includes(name) ? `${normalized}Type` : normalized;
};
exports.getIOName = (name) => `${normalize(name)}IO`;
exports.getURL = (pattern, pathParameters) => pathParameters.reduce((acc, p) => acc.replace(`{${p.name}}`, `\$\{encodeURIComponent(${p.io}.toString())\}`), `\`${pattern}\``);
exports.getJSDoc = (lines) => string_1.unless(lines.length === 0, `/**
			 ${lines.map(line => `* ${line}`).join('\n')}
		 */`);
exports.defaultPrettierConfig = {
    bracketSpacing: true,
    jsxBracketSameLine: true,
    parser: 'typescript',
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: true,
};
exports.pathsRef = ref_1.fromString('#/paths');
exports.getKindValue = (kind, value) => {
    switch (kind) {
        case 'HKT': {
            return `HKT<F, ${value}>`;
        }
        case '*': {
            return `Kind<F, ${value}>`;
        }
        case '* -> *': {
            return `Kind2<F, Error, ${value}>`;
        }
    }
};
exports.getControllerName = (name) => `${name}Controller`;
const COMMENT_PATTERN = /\/\*(.*)\*\//;
const REPLACE_COMMENT_PATTERN = new RegExp(COMMENT_PATTERN, 'g');
exports.escapeCommpent = (value) => value.replace(REPLACE_COMMENT_PATTERN, '\\/*$1*\\/');
exports.UNSAFE_PROPERTY_PATTERN = /[^a-zA-Z_0-9]/;
const REPLACE_PATTERN = new RegExp(exports.UNSAFE_PROPERTY_PATTERN, 'g');
exports.getSafePropertyName = (value) => value.replace(REPLACE_PATTERN, '_').replace(/^(\d)/, '_$1') || '_';
exports.context = Reader_1.ask();
exports.getKeyMatchValue = (record, regexp) => pipeable_1.pipe(record, Record_1.keys, fp_ts_1.array.findFirst(s => regexp.test(s)), fp_ts_1.option.map(key => ({ key, value: record[key] })));
exports.getKeyMatchValues = (record, regexp) => pipeable_1.pipe(record, Record_1.keys, fp_ts_1.array.filter(s => regexp.test(s)), fp_ts_1.nonEmptyArray.fromArray, fp_ts_1.option.map(fp_ts_1.nonEmptyArray.map(key => ({ key, value: record[key] }))));
const blobMediaRegexp = /^(video|audio|image|application)/;
const textMediaRegexp = /^text/;
exports.DEFAULT_MEDIA_TYPE = 'application/json';
exports.getResponseTypeFromMediaType = (mediaType) => {
    if (mediaType === 'application/json') {
        return 'json';
    }
    if (blobMediaRegexp.test(mediaType)) {
        return 'blob';
    }
    if (textMediaRegexp.test(mediaType)) {
        return 'text';
    }
    return 'json';
};
