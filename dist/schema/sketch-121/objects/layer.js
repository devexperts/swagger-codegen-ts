"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("./style");
const object_id_1 = require("./object-id");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const override_value_1 = require("./override-value");
const layer_class_1 = require("../enums/layer-class");
exports.LayerCodec = io_ts_1.recursion('Layer', () => io_ts_1.type({
    _class: layer_class_1.LayerClassCodec,
    do_objectID: object_id_1.ObjectIDCodec,
    name: io_ts_1.string,
    style: style_1.StyleCodec,
    isVisible: io_ts_1.boolean,
    layers: optionFromNullable_1.optionFromNullable(io_ts_1.array(exports.LayerCodec)),
    overrideValues: optionFromNullable_1.optionFromNullable(io_ts_1.array(override_value_1.OverrideValueCodec)),
    sharedStyleID: optionFromNullable_1.optionFromNullable(object_id_1.ObjectIDCodec),
    symbolID: optionFromNullable_1.optionFromNullable(object_id_1.ObjectIDCodec),
}, 'Layer'));
