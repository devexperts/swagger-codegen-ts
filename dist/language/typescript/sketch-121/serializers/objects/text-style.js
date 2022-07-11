"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pipeable_1 = require("fp-ts/lib/pipeable");
const fp_ts_1 = require("fp-ts");
const color_1 = require("./color");
const text_vertical_alignment_1 = require("../enums/text-vertical-alignment");
const text_horizontal_alignment_1 = require("../enums/text-horizontal-alignment");
const underline_style_1 = require("../enums/underline-style");
exports.serializeTextStyle = (textStyle) => {
    const textAlign = pipeable_1.pipe(textStyle.encodedAttributes.paragraphStyle, fp_ts_1.option.chain(style => style.alignment), fp_ts_1.option.chain(alignment => fp_ts_1.option.fromEither(text_horizontal_alignment_1.serializeTextHorizontalAlignment(alignment))), fp_ts_1.option.map(alignment => `textAlign: ${JSON.stringify(alignment)}`));
    const lineHeight = pipeable_1.pipe(textStyle.encodedAttributes.paragraphStyle, fp_ts_1.option.chain(style => style.maximumLineHeight), fp_ts_1.option.alt(() => pipeable_1.pipe(textStyle.encodedAttributes.paragraphStyle, fp_ts_1.option.chain(style => style.minimumLineHeight))), fp_ts_1.option.map(lineHeight => `lineHeight: '${lineHeight}px'`));
    const textDecoration = pipeable_1.pipe(textStyle.encodedAttributes.underlineStyle, fp_ts_1.option.map(style => `textDecoration: ${JSON.stringify(underline_style_1.serializeUnderlineStyle(style))}`));
    const letterSpacing = pipeable_1.pipe(textStyle.encodedAttributes.kerning, fp_ts_1.option.map(kerning => `letterSpacing: '${kerning}px'`));
    const color = pipeable_1.pipe(textStyle.encodedAttributes.MSAttributedStringColorAttribute, fp_ts_1.option.map(color => `color: ${JSON.stringify(color_1.serializeColor(color))}`));
    const verticalAlign = `verticalAlign: ${JSON.stringify(text_vertical_alignment_1.serializeTextVerticalAlignment(textStyle.verticalAlignment))}`;
    const fontFamily = `fontFamily: ${JSON.stringify(textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name)}`;
    const fontSize = `fontSize: '${textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}px'`;
    return [
        fontFamily,
        fontSize,
        verticalAlign,
        ...fp_ts_1.array.compact([color, textAlign, lineHeight, textDecoration, letterSpacing]),
    ].join(', ');
};
