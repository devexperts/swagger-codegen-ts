"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_ts_1 = require("fp-ts");
exports.traverseArrayEither = fp_ts_1.array.array.traverse(fp_ts_1.either.either);
exports.traverseNEAEither = fp_ts_1.nonEmptyArray.nonEmptyArray.traverse(fp_ts_1.either.either);
exports.traverseOptionEither = fp_ts_1.option.option.traverse(fp_ts_1.either.either);
