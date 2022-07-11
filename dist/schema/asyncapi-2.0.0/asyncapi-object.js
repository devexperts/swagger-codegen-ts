"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info_object_1 = require("./info-object");
const servers_object_1 = require("./servers-object");
const io_ts_1 = require("io-ts");
const optionFromNullable_1 = require("io-ts-types/lib/optionFromNullable");
const channels_object_1 = require("./channels-object");
const components_object_1 = require("./components-object");
const tags_object_1 = require("./tags-object");
const external_documentation_object_1 = require("./external-documentation-object");
exports.AsyncAPIObjectCodec = io_ts_1.type({
    asyncapi: io_ts_1.literal('2.0.0'),
    info: info_object_1.InfoObjectCodec,
    servers: optionFromNullable_1.optionFromNullable(servers_object_1.ServersObjectCodec),
    channels: channels_object_1.ChannelsObjectCodec,
    components: optionFromNullable_1.optionFromNullable(components_object_1.ComponentsObjectCodec),
    tags: optionFromNullable_1.optionFromNullable(tags_object_1.TagsObjectCodec),
    externalDocs: optionFromNullable_1.optionFromNullable(external_documentation_object_1.ExternalDocumentationObjectCodec),
}, 'AsyncAPIObject');
