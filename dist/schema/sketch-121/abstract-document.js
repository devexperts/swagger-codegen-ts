"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_style_container_1 = require("./objects/shared-style-container");
const io_ts_1 = require("io-ts");
const shared_text_style_container_1 = require("./objects/shared-text-style-container");
const foreign_layer_style_1 = require("./objects/foreign-layer-style");
const foreign_text_style_1 = require("./objects/foreign-text-style");
const asset_collection_1 = require("./objects/asset-collection");
const object_id_1 = require("./objects/object-id");
const foreign_symbol_1 = require("./objects/foreign-symbol");
exports.AbstractDocumentCodec = io_ts_1.type({
    do_objectID: object_id_1.ObjectIDCodec,
    assets: asset_collection_1.AssetCollectionCodec,
    foreignLayerStyles: io_ts_1.array(foreign_layer_style_1.ForeignLayerStyleCodec),
    foreignTextStyles: io_ts_1.array(foreign_text_style_1.ForeignTextStyleCodec),
    foreignSymbols: io_ts_1.array(foreign_symbol_1.ForeignSymbolCodec),
    layerTextStyles: shared_text_style_container_1.SharedTextStyleContainerCodec,
    layerStyles: shared_style_container_1.SharedStyleContainerCodec,
});
