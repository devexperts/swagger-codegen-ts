import { BlendMode } from '../../../../../schema/sketch-121/enums/blend-mode';
import { Either, left, right } from 'fp-ts/lib/Either';

/**
 * @see https://www.w3schools.com/cssref/pr_background-blend-mode.asp
 */
export type BackgroundBlendMode =
	| 'normal'
	| 'multiply'
	| 'screen'
	| 'overlay'
	| 'darken'
	| 'lighten'
	| 'color-dodge'
	| 'saturation'
	| 'color'
	| 'luminosity';

/**
 * @see https://www.w3schools.com/cssref/pr_mix-blend-mode.asp
 */
export type MixBlendMode =
	| 'normal'
	| 'multiply'
	| 'screen'
	| 'overlay'
	| 'darken'
	| 'lighten'
	| 'color-dodge'
	| 'color-burn'
	| 'difference'
	| 'exclusion'
	| 'hue'
	| 'saturation'
	| 'color'
	| 'luminosity';

export const getBackgroundBlendMode = (mode: BlendMode): Either<Error, BackgroundBlendMode> => {
	const invalid = left(new Error(`Unsupported BlendMode for background-blend-mode: "${mode}"`));

	switch (mode) {
		case 'Normal':
			return right('normal');
		case 'Darken':
			return right('darken');
		case 'Multiply':
			return right('multiply');
		case 'Color burn':
			return invalid;
		case 'Lighten':
			return right('lighten');
		case 'Screen':
			return right('screen');
		case 'Color dodge':
			return right('color-dodge');
		case 'Overlay':
			return right('overlay');
		case 'Soft light':
			return invalid;
		case 'Hard light':
			return invalid;
		case 'Difference':
			return invalid;
		case 'Exclusion':
			return invalid;
		case 'Hue':
			return invalid;
		case 'Saturation':
			return right('saturation');
		case 'Color':
			return right('color');
		case 'Luminosity':
			return right('luminosity');
		case 'Plus darker':
			return invalid;
		case 'Plus lighter':
			return invalid;
	}
};

export const getMixBlendMode = (mode: BlendMode): Either<Error, MixBlendMode> => {
	const invalid = left(new Error(`Unsupported BlendMode for mix-blend-mode: "${mode}"`));

	switch (mode) {
		case 'Normal':
			return right('normal');
		case 'Darken':
			return right('darken');
		case 'Multiply':
			return right('multiply');
		case 'Color burn':
			return right('color-burn');
		case 'Lighten':
			return right('lighten');
		case 'Screen':
			return right('screen');
		case 'Color dodge':
			return right('color-dodge');
		case 'Overlay':
			return right('overlay');
		case 'Soft light':
			return invalid;
		case 'Hard light':
			return invalid;
		case 'Difference':
			return right('difference');
		case 'Exclusion':
			return right('exclusion');
		case 'Hue':
			return right('hue');
		case 'Saturation':
			return right('saturation');
		case 'Color':
			return right('color');
		case 'Luminosity':
			return right('luminosity');
		case 'Plus darker':
			return invalid;
		case 'Plus lighter':
			return invalid;
	}
};
