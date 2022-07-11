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
const io_ts_1 = require("io-ts");
const fs_1 = require("./utils/fs");
const path = require("path");
const $RefParser = require("json-schema-ref-parser");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const Either_1 = require("fp-ts/lib/Either");
const function_1 = require("fp-ts/lib/function");
const io_ts_2 = require("./utils/io-ts");
const sketch_121_1 = require("./parsers/sketch-121");
const log = (...args) => console.log('[SWAGGER-CODEGEN-TS]:', ...args);
const getUnsafe = fp_ts_1.either.fold(e => {
    throw e;
}, function_1.identity);
exports.generate = (options) => fp_ts_1.taskEither.tryCatch(() => __awaiter(void 0, void 0, void 0, function* () {
    const cwd = options.cwd || process.cwd();
    const out = path.isAbsolute(options.out) ? options.out : path.resolve(cwd, options.out);
    const spec = path.isAbsolute(options.spec) ? options.spec : path.resolve(cwd, options.spec);
    log('Processing', spec);
    const $refs = yield $RefParser.resolve(spec, {
        dereference: {
            circular: 'ignore',
        },
        parse: {
            sketch: sketch_121_1.sketchParser121,
        },
    });
    const specs = pipeable_1.pipe(Object.entries($refs.values()), fp_ts_1.array.reduce({}, (acc, [fullPath, schema]) => {
        const isRoot = fullPath === spec;
        const relative = path.relative(cwd, fullPath);
        // skip specLike check for root because it should always be decoded with passed decoder and fail
        if (!isRoot && Either_1.isLeft(specLikeCodec.decode(schema))) {
            log('Unable to decode', relative, 'as spec. Treat it as an arbitrary json.');
            // this is not a spec - treat as arbitrary json
            return acc;
        }
        // use getUnsafe to fail fast if unable to decode a spec
        const decoded = getUnsafe(io_ts_2.reportIfFailed(options.decoder.decode(schema)));
        log('Decoded', relative);
        return Object.assign(Object.assign({}, acc), { [relative]: decoded });
    }));
    log('Writing to', out);
    const resolveRef = ($ref, decoder) => pipeable_1.pipe(fp_ts_1.either.tryCatch(() => $refs.get($ref), Either_1.toError), fp_ts_1.either.chain(resolved => io_ts_2.reportIfFailed(decoder.decode(resolved))));
    yield fs_1.write(out, getUnsafe(options.language({ resolveRef })(specs)));
    log('Done');
}), function_1.identity);
const specLikeCodec = io_ts_1.union([
    io_ts_1.type({
        swagger: io_ts_1.literal('2.0'),
    }),
    io_ts_1.type({
        openapi: io_ts_1.union([io_ts_1.literal('3.0.0'), io_ts_1.literal('3.0.1'), io_ts_1.literal('3.0.2')]),
    }),
    io_ts_1.type({
        asyncapi: io_ts_1.literal('2.0.0'),
    }),
    io_ts_1.type({
        // sketch-like structure
        meta: io_ts_1.type({
            version: io_ts_1.literal(121),
        }),
    }),
]);
