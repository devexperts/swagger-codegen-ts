"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const c = require("color");
const toValue = (unit) => Math.round(255 * unit);
exports.serializeColor = (color) => c({
    alpha: color.alpha,
    r: toValue(color.red),
    g: toValue(color.green),
    b: toValue(color.blue),
}).string();
