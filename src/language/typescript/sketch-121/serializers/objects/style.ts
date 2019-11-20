import { Style } from '../../../../../schema/sketch-121/objects/style';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { serializeColor } from './color';
import { serializeGradient } from './gradient';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';
import { getBackgroundBlendMode, getMixBlendMode } from '../enums/blend-mode';
import { serializeBorder } from './border';
import { sequenceOptionEither } from '../../../../../utils/option';
import { serializeInnerShadow } from './inner-shadow';
import { serializeShadow } from './shadow';
import { serializeTextStyle } from './text-style';

export const serializeStyle = (style: Style): Either<Error, string> => {
	const fills = pipe(
		style.fills,
		option.map(array.filter(fill => fill.isEnabled)),
		option.chain(nonEmptyArray.fromArray),
	);
	const borders = pipe(
		style.borders,
		option.map(array.filter(border => border.isEnabled)),
	);

	const innerShadows = style.innerShadows.filter(shadow => shadow.isEnabled);
	const shadows = pipe(
		style.shadows,
		option.map(array.filter(shadow => shadow.isEnabled)),
	);

	const backgroundColor = pipe(
		fills,
		option.chain(nonEmptyArray.filter(fill => fill.fillType === 'Color')),
		option.map(fills =>
			pipe(
				fills,
				nonEmptyArray.map(fill => serializeColor(fill.color)),
				colors => `backgroundColor: '${colors.join(', ')}'`,
			),
		),
	);
	const backgroundImage = pipe(
		fills,
		option.chain(nonEmptyArray.filter(fill => fill.fillType === 'Gradient')),
		option.map(fills =>
			pipe(
				fills,
				nonEmptyArray.map(fill => serializeGradient(fill.gradient)),
				nonEmptyArray.nonEmptyArray.sequence(either.either),
				either.map(gradients => `backgroundImage: '${gradients.join(', ')}'`),
			),
		),
		sequenceOptionEither,
	);
	const backgroundBlendMode = pipe(
		fills,
		option.map(array.filterMap(fill => option.fromEither(getBackgroundBlendMode(fill.contextSettings.blendMode)))),
		option.chain(array.last),
		option.filter(mode => mode !== 'normal'),
		option.map(mode => `backgroundBlendMode: '${mode}'`),
	);
	const mixBlendMode = pipe(
		style.contextSettings,
		option.chain(settings => option.fromEither(getMixBlendMode(settings.blendMode))),
		option.filter(mode => mode !== 'normal'),
		option.map(mode => `mixBlendMode: '${mode}'`),
	);
	const opacity = pipe(
		style.contextSettings,
		option.map(settings => settings.opacity),
		option.filter(n => n !== 1),
		option.map(opacity => `opacity: '${opacity}'`),
	);

	const border = pipe(
		borders,
		option.map(array.filterMap(border => option.fromEither(serializeBorder(border, style.borderOptions)))),
		option.chain(array.last),
	);

	const boxShadow = pipe(
		nonEmptyArray.fromArray([
			...innerShadows.map(serializeInnerShadow),
			...array.flatten(
				array.compact([
					pipe(
						shadows,
						option.map(array.map(serializeShadow)),
					),
				]),
			),
		]),
		option.map(shadows => `boxShadow: '${shadows.join(', ')}'`),
	);

	const textStyle = pipe(
		style.textStyle,
		option.map(serializeTextStyle),
	);

	return combineEither(backgroundImage, backgroundImage =>
		array
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
			.join(', '),
	);
};
