import { TextStyle } from '../../../../../schema/sketch-121/objects/text-style';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, option } from 'fp-ts';
import { serializeColor } from './color';
import { serializeTextVerticalAlignment } from '../enums/text-vertical-alignment';
import { serializeTextHorizontalAlignment } from '../enums/text-horizontal-alignment';
import { serializeUnderlineStyle } from '../enums/underline-style';

export const serializeTextStyle = (textStyle: TextStyle): string => {
	const textAlign = pipe(
		textStyle.encodedAttributes.paragraphStyle,
		option.chain(style => style.alignment),
		option.chain(alignment => option.fromEither(serializeTextHorizontalAlignment(alignment))),
		option.map(alignment => `textAlign: ${JSON.stringify(alignment)}`),
	);

	const lineHeight = pipe(
		textStyle.encodedAttributes.paragraphStyle,
		option.chain(style => style.maximumLineHeight),
		option.alt(() =>
			pipe(
				textStyle.encodedAttributes.paragraphStyle,
				option.chain(style => style.minimumLineHeight),
			),
		),
		option.map(lineHeight => `lineHeight: '${lineHeight}px'`),
	);

	const textDecoration = pipe(
		textStyle.encodedAttributes.underlineStyle,
		option.map(style => `textDecoration: ${JSON.stringify(serializeUnderlineStyle(style))}`),
	);

	const letterSpacing = pipe(
		textStyle.encodedAttributes.kerning,
		option.map(kerning => `letterSpacing: '${kerning}px'`),
	);

	const color = pipe(
		textStyle.encodedAttributes.MSAttributedStringColorAttribute,
		option.map(color => `color: ${JSON.stringify(serializeColor(color))}`),
	);

	const verticalAlign = `verticalAlign: ${JSON.stringify(
		serializeTextVerticalAlignment(textStyle.verticalAlignment),
	)}`;

	const fontFamily = `fontFamily: ${JSON.stringify(
		textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name,
	)}`;

	const fontSize = `fontSize: '${textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}px'`;

	return [
		fontFamily,
		fontSize,
		verticalAlign,
		...array.compact([color, textAlign, lineHeight, textDecoration, letterSpacing]),
	].join(', ');
};
