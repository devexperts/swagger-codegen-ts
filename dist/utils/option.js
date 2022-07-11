"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_ts_1 = require("fp-ts");
exports.sequenceOptionEither = fp_ts_1.option.option.sequence(fp_ts_1.either.either);
