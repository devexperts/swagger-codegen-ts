"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Array_1 = require("fp-ts/lib/Array");
const Eq_1 = require("fp-ts/lib/Eq");
exports.uniqString = Array_1.uniq(Eq_1.eqString);
exports.concatIfL = (condition, as, a) => condition ? as.concat(a(as)) : as;
exports.concatIf = (condition, as, a) => exports.concatIfL(condition, as, () => a);
exports.includes = (a) => (as) => as.includes(a);
exports.join = (s) => (as) => as.join(s);
