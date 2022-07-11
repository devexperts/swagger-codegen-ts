"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_asset_1 = require("./color-asset");
const io_ts_1 = require("io-ts");
const color_1 = require("./color");
const gradient_1 = require("./gradient");
const gradient_asset_1 = require("./gradient-asset");
const object_id_1 = require("./object-id");
exports.AssetCollectionCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    colorAssets: io_ts_1.array(color_asset_1.ColorAssetCodec),
    gradientAssets: io_ts_1.array(gradient_asset_1.GradientAssetCodec),
    colors: io_ts_1.array(color_1.ColorCodec),
    gradients: io_ts_1.array(gradient_1.GradientCodec),
});
