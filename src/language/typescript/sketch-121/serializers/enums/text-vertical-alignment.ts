import { TextVerticalAlignment } from '../../../../../schema/sketch-121/enums/text-vertical-alignment';

export const serializeTextVerticalAlignment = (alignment: TextVerticalAlignment): string => {
	switch (alignment) {
		case 'Top': {
			return 'top';
		}
		case 'Middle': {
			return 'middle';
		}
		case 'Bottom': {
			return 'bottom';
		}
	}
};
