"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const ref_1 = require("./ref");
const string_1 = require("./string");
const pipeable_1 = require("fp-ts/lib/pipeable");
const NonEmptyArray_1 = require("fp-ts/lib/NonEmptyArray");
const fp_ts_1 = require("fp-ts");
exports.file = (name, content) => ({
    type: 'FILE',
    name,
    content,
});
exports.directory = (name, content) => ({
    type: 'DIRECTORY',
    name,
    content: flatten(content),
});
exports.fragment = (content) => ({
    type: 'FRAGMENT',
    content: flatten(content),
});
exports.write = (destination, entity) => __awaiter(void 0, void 0, void 0, function* () {
    switch (entity.type) {
        case 'FILE': {
            const normalizedEntityName = normalizeFilePath(entity.name);
            const filePath = path.resolve(destination, normalizedEntityName);
            yield fs.outputFile(filePath, entity.content);
            break;
        }
        case 'DIRECTORY': {
            const directoryPath = path.resolve(destination, entity.name);
            yield fs.mkdirp(directoryPath);
            for (const contentEntity of entity.content) {
                yield exports.write(directoryPath, contentEntity);
            }
            break;
        }
        case 'FRAGMENT': {
            for (const contentEntity of entity.content) {
                yield exports.write(destination, contentEntity);
            }
            break;
        }
    }
});
exports.map = (entity, f) => {
    switch (entity.type) {
        case 'FILE': {
            return exports.file(entity.name, f(entity.content));
        }
        case 'DIRECTORY': {
            return exports.directory(entity.name, entity.content.map(entity => exports.map(entity, f)));
        }
        case 'FRAGMENT': {
            return exports.fragment(entity.content.map(entity => exports.map(entity, f)));
        }
    }
};
exports.fromRef = (ref, extname, content) => {
    const parts = pipeable_1.pipe(ref, ref_1.getFullPath, string_1.split('/'), NonEmptyArray_1.reverse);
    return NonEmptyArray_1.tail(parts).reduce((acc, part) => exports.directory(part, [acc]), exports.file(`${NonEmptyArray_1.head(parts)}${extname}`, content));
};
const flatten = (entities) => entities.reduce((acc, entity) => (entity.type === 'FRAGMENT' ? acc.concat(...entity.content) : acc.concat(entity)), fp_ts_1.array.array.zero());
const normalizeFilePath = (filePath) => filePath.startsWith(path.sep) ? normalizeFilePath(filePath.slice(1)) : filePath;
