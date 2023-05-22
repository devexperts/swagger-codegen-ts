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
const AdmZip = require("adm-zip");
const io_ts_1 = require("io-ts");
const Either_1 = require("fp-ts/lib/Either");
const log = (...args) => console.log('[SKETCH-PARSER]:', ...args);
exports.sketchParser121 = {
    order: 90,
    allowEmpty: false,
    canParse: (file) => file.extension === 'sketch',
    parse: (file) => __awaiter(void 0, void 0, void 0, function* () {
        log('Unzipping', file.url);
        const zip = new AdmZip(file.data);
        log('Parsing document.json');
        const document = toJSON(zip.getEntry('document.json').getData());
        log('Parsing meta.json');
        const meta = toJSON(zip.getEntry('meta.json').getData());
        log('Parsing user.json');
        const user = toJSON(zip.getEntry('user.json').getData());
        const decodedDocument = documentCodec.decode(document);
        if (Either_1.isLeft(decodedDocument)) {
            throw decodedDocument.left;
        }
        const pages = decodedDocument.right.pages.map(page => {
            const entry = `${page._ref}.json`;
            log('Parsing', entry);
            return toJSON(zip.getEntry(entry).getData());
        });
        log('Done');
        return {
            document: Object.assign(Object.assign({}, document), { pages }),
            meta,
            user,
        };
    }),
};
const documentCodec = io_ts_1.type({
    pages: io_ts_1.array(io_ts_1.type({
        _ref: io_ts_1.string,
    })),
});
const toJSON = (buffer) => JSON.parse(buffer.toString('utf-8'));
