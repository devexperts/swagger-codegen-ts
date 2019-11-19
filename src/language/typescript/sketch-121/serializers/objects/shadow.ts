import { serializeColor } from './color';
import { Shadow } from '../../../../../schema/sketch-121/objects/shadow';

export const serializeShadow = (shadow: Shadow): string => {
	const color = serializeColor(shadow.color);
	return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blurRadius}px ${shadow.spread}px ${color}`;
};
