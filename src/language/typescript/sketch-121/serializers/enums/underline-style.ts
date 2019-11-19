import { UnderlineStyle } from '../../../../../schema/sketch-121/enums/underline-style';

export const serializeUnderlineStyle = (style: UnderlineStyle): string => {
	switch (style) {
		case 'None': {
			return 'normal';
		}
		case 'Underlined': {
			return 'underline';
		}
	}
};
