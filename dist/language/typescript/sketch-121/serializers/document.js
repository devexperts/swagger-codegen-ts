"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_styled_container_1 = require("./objects/shared-styled-container");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const shared_text_style_container_1 = require("./objects/shared-text-style-container");
const foreign_layer_style_1 = require("./objects/foreign-layer-style");
const either_1 = require("../../../../utils/either");
const option_1 = require("../../../../utils/option");
const foreign_text_style_1 = require("./objects/foreign-text-style");
const fs_1 = require("../../../../utils/fs");
const asset_collection_1 = require("./objects/asset-collection");
const page_1 = require("./objects/page");
exports.serializeDocument = reader_utils_1.combineReader(shared_styled_container_1.serializeSharedStyleContainer, shared_text_style_container_1.serializeSharedTextStyleContainer, foreign_layer_style_1.serializeForeignLayerStyle, foreign_text_style_1.serializeForeignTextStyle, asset_collection_1.serializeAssetCollection, page_1.serializePage, (serializeSharedStyleContainer, serializeSharedTextStyleContainer, serializeForeignLayerStyle, serializeForeignTextStyle, serializeAssetCollection, serializePage) => (document) => {
    const layerStyles = pipeable_1.pipe(serializeSharedStyleContainer(document.layerStyles), fp_ts_1.either.map(fp_ts_1.option.map(content => fs_1.file('layer-styles.ts', content))));
    const layerTextStyles = pipeable_1.pipe(serializeSharedTextStyleContainer(document.layerTextStyles), fp_ts_1.either.map(fp_ts_1.option.map(content => fs_1.file('layer-text-styles.ts', content))));
    const foreignLayerStyles = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(document.foreignLayerStyles), fp_ts_1.option.map(styles => pipeable_1.pipe(either_1.traverseNEAEither(styles, serializeForeignLayerStyle), fp_ts_1.either.map(styles => fs_1.file('foreign-layer-styles.ts', styles.join(''))))), option_1.sequenceOptionEither);
    const foreignTextStyles = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(document.foreignTextStyles), fp_ts_1.option.map(styles => pipeable_1.pipe(either_1.traverseNEAEither(styles, serializeForeignTextStyle), fp_ts_1.either.map(styles => fs_1.file('foreign-text-styles.ts', styles.join(''))))), option_1.sequenceOptionEither);
    const assets = pipeable_1.pipe(serializeAssetCollection(document.assets), fp_ts_1.either.map(fp_ts_1.option.map(assets => fs_1.file('assets.ts', assets))));
    const layers = either_1.traverseOptionEither(fp_ts_1.nonEmptyArray.fromArray(document.pages), pages => pipeable_1.pipe(either_1.traverseNEAEither(pages, serializePage), fp_ts_1.either.map(pagesLayers => fs_1.file('layers.ts', pagesLayers.join('')))));
    return either_utils_1.combineEither(layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles, assets, layers, (layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles, assets, layers) => pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray(fp_ts_1.array.compact([
        layerStyles,
        layerTextStyles,
        foreignLayerStyles,
        foreignTextStyles,
        assets,
        layers,
    ])), fp_ts_1.option.map(fs_1.fragment)));
});
