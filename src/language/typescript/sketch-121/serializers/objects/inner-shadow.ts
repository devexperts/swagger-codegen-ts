import { InnerShadow } from '../../../../../schema/sketch-121/objects/inner-shadow';
import { serializeColor } from './color';

export const serializeInnerShadow = (shadow: InnerShadow): string => {
	const color = serializeColor(shadow.color);
	return `inset ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${color}`;
};
