"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("../../../../utils/fs");
const reader_utils_1 = require("@devexperts/utils/dist/adt/reader.utils");
const components_object_1 = require("./components-object");
const ref_1 = require("../../../../utils/ref");
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const channels_object_1 = require("./channels-object");
const client_1 = require("../../common/bundled/client");
const utils_1 = require("../../common/bundled/utils");
exports.serializeAsyncAPIObject = reader_utils_1.combineReader(components_object_1.serializeComponentsObject, channels_object_1.serializeChannelsObject, (serializeComponentsObject, serializeChannelsObject) => (name, asyncAPIObject) => {
    const components = pipeable_1.pipe(asyncAPIObject.components, fp_ts_1.option.map(components => pipeable_1.pipe(ref_1.fromString('#/components'), fp_ts_1.either.chain(from => serializeComponentsObject(from, components)), fp_ts_1.either.map(content => fs_1.directory('components', [content])))));
    const additional = pipeable_1.pipe(fp_ts_1.array.compact([components]), either_utils_1.sequenceEither);
    const channels = pipeable_1.pipe(ref_1.fromString('#/channels'), fp_ts_1.either.chain(from => serializeChannelsObject(from, asyncAPIObject.channels)), fp_ts_1.either.map(content => fs_1.directory('channels', [content])));
    return either_utils_1.combineEither(channels, additional, client_1.clientFile, utils_1.utilsFile, (channels, additional, clientFile, utilsFile) => fs_1.directory(name, [channels, clientFile, ...additional, utilsFile]));
});
