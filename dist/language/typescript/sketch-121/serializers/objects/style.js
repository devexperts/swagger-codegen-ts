"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const color_1 = require("./color");
const gradient_1 = require("./gradient");
const either_utils_1 = require("@devexperts/utils/dist/adt/either.utils");
const blend_mode_1 = require("../enums/blend-mode");
const border_1 = require("./border");
const option_1 = require("../../../../../utils/option");
const inner_shadow_1 = require("./inner-shadow");
const shadow_1 = require("./shadow");
const text_style_1 = require("./text-style");
exports.serializeStyle = (style) => {
    const fills = pipeable_1.pipe(style.fills, fp_ts_1.option.map(fp_ts_1.array.filter(fill => fill.isEnabled)), fp_ts_1.option.chain(fp_ts_1.nonEmptyArray.fromArray));
    const borders = pipeable_1.pipe(style.borders, fp_ts_1.option.map(fp_ts_1.array.filter(border => border.isEnabled)));
    const innerShadows = style.innerShadows.filter(shadow => shadow.isEnabled);
    const shadows = pipeable_1.pipe(style.shadows, fp_ts_1.option.map(fp_ts_1.array.filter(shadow => shadow.isEnabled)));
    const backgroundColor = pipeable_1.pipe(fills, fp_ts_1.option.chain(fp_ts_1.nonEmptyArray.filter(fill => fill.fillType === 'Color')), fp_ts_1.option.map(fills => pipeable_1.pipe(fills, fp_ts_1.nonEmptyArray.map(fill => color_1.serializeColor(fill.color)), colors => `backgroundColor: '${colors.join(', ')}'`)));
    const backgroundImage = pipeable_1.pipe(fills, fp_ts_1.option.chain(fp_ts_1.nonEmptyArray.filter(fill => fill.fillType === 'Gradient')), fp_ts_1.option.map(fills => pipeable_1.pipe(fills, fp_ts_1.nonEmptyArray.map(fill => gradient_1.serializeGradient(fill.gradient)), fp_ts_1.nonEmptyArray.nonEmptyArray.sequence(fp_ts_1.either.either), fp_ts_1.either.map(gradients => `backgroundImage: '${gradients.join(', ')}'`))), option_1.sequenceOptionEither);
    const backgroundBlendMode = pipeable_1.pipe(fills, fp_ts_1.option.map(fp_ts_1.array.filterMap(fill => fp_ts_1.option.fromEither(blend_mode_1.getBackgroundBlendMode(fill.contextSettings.blendMode)))), fp_ts_1.option.chain(fp_ts_1.array.last), fp_ts_1.option.filter(mode => mode !== 'normal'), fp_ts_1.option.map(mode => `backgroundBlendMode: '${mode}'`));
    const mixBlendMode = pipeable_1.pipe(style.contextSettings, fp_ts_1.option.chain(settings => fp_ts_1.option.fromEither(blend_mode_1.getMixBlendMode(settings.blendMode))), fp_ts_1.option.filter(mode => mode !== 'normal'), fp_ts_1.option.map(mode => `mixBlendMode: '${mode}'`));
    const opacity = pipeable_1.pipe(style.contextSettings, fp_ts_1.option.map(settings => settings.opacity), fp_ts_1.option.filter(n => n !== 1), fp_ts_1.option.map(opacity => `opacity: '${opacity}'`));
    const border = pipeable_1.pipe(borders, fp_ts_1.option.map(fp_ts_1.array.filterMap(border => fp_ts_1.option.fromEither(border_1.serializeBorder(border, style.borderOptions)))), fp_ts_1.option.chain(fp_ts_1.array.last));
    const boxShadow = pipeable_1.pipe(fp_ts_1.nonEmptyArray.fromArray([
        ...innerShadows.map(inner_shadow_1.serializeInnerShadow),
        ...fp_ts_1.array.flatten(fp_ts_1.array.compact([pipeable_1.pipe(shadows, fp_ts_1.option.map(fp_ts_1.array.map(shadow_1.serializeShadow)))])),
    ]), fp_ts_1.option.map(shadows => `boxShadow: '${shadows.join(', ')}'`));
    const textStyle = pipeable_1.pipe(style.textStyle, fp_ts_1.option.map(text_style_1.serializeTextStyle));
    return either_utils_1.combineEither(backgroundImage, backgroundImage => fp_ts_1.array
        .compact([
        backgroundBlendMode,
        backgroundColor,
        backgroundImage,
        mixBlendMode,
        opacity,
        border,
        boxShadow,
        textStyle,
    ])
        .join(', '));
};
