import { TextHorizontalAlignment } from '../../../../../schema/sketch-121/enums/text-horizontal-alignment';
import { Either, left, right } from 'fp-ts/lib/Either';

export const serializeTextHorizontalAlignment = (alignment: TextHorizontalAlignment): Either<Error, string> => {
	switch (alignment) {
		case 'Centered': {
			return right('center');
		}
		case 'Justified': {
			return right('justify');
		}
		case 'Left': {
			return right('left');
		}
		case 'Right': {
			return right('right');
		}
		case 'Natural': {
			return left(new Error('TextHorizontalAlignment.Natural is not supported'));
		}
	}
};
