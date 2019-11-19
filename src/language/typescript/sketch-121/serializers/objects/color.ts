import { Color } from '../../../../../schema/sketch-121/objects/color';
import * as c from 'color';
import { UnitInterval } from '../../../../../schema/sketch-121/utils/unit-interval';

const toValue = (unit: UnitInterval): number => Math.round(255 * unit);
export const serializeColor = (color: Color): string =>
	c({
		alpha: color.alpha,
		r: toValue(color.red),
		g: toValue(color.green),
		b: toValue(color.blue),
	}).string();
