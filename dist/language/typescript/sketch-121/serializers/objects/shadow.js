"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./color");
exports.serializeShadow = (shadow) => {
    const color = color_1.serializeColor(shadow.color);
    return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${color}`;
};
