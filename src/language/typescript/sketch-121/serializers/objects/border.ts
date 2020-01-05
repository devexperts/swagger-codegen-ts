import { Border } from '../../../../../schema/sketch-121/objects/border';
import { Either, left, right } from 'fp-ts/lib/Either';
import { serializeColor } from './color';
import { BorderOptions } from '../../../../../schema/sketch-121/objects/border-options';
import { serializeGradient } from './gradient';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';

export const serializeBorder = (border: Border, borderOptions: BorderOptions): Either<Error, string> => {
	const width = `${border.thickness}px`;
	const style = borderOptions.isEnabled && borderOptions.dashPattern.length > 0 ? 'dashed' : 'solid';

	switch (border.fillType) {
		case 'Color':
			const color = serializeColor(border.color);
			return right(`border: '${style} ${width} ${color}'`);
		case 'Gradient':
			const gradient = serializeGradient(border.gradient);
			return pipe(
				gradient,
				either.map(
					gradient => `
						borderStyle: '${style}',
						borderWidth: '${width}',
						borderImageSource: '${gradient}',
						borderImageSlice: '1'
					`,
				),
			);
		case 'Pattern': {
			return left(new Error(`Border.fillType "Pattern" is not supported`));
		}
	}
};
