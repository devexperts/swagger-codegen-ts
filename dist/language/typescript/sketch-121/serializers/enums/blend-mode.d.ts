import { BlendMode } from '../../../../../schema/sketch-121/enums/blend-mode';
import { Either } from 'fp-ts/lib/Either';
/**
 * @see https://www.w3schools.com/cssref/pr_background-blend-mode.asp
 */
export declare type BackgroundBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'saturation' | 'color' | 'luminosity';
/**
 * @see https://www.w3schools.com/cssref/pr_mix-blend-mode.asp
 */
export declare type MixBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
export declare const getBackgroundBlendMode: (mode: BlendMode) => Either<Error, BackgroundBlendMode>;
export declare const getMixBlendMode: (mode: BlendMode) => Either<Error, MixBlendMode>;
