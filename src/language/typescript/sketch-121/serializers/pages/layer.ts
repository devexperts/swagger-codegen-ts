import { Layer } from '../../../../../schema/sketch-121/pages/layer';
import { Either } from 'fp-ts/lib/Either';
import { getJSDoc } from '../../../common/utils';
import { serializeStyle } from '../objects/style';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { context } from '../../utils';
import { option, either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { traverseArrayEither } from '../../../../../utils/either';
import { sequenceOptionEither } from '../../../../../utils/option';
import { identity, constant } from 'fp-ts/lib/function';

export const serializeLayer = combineReader(context, context => (layer: Layer, jsdoc?: string[]): Either<
	Error,
	string
> => {
	const safeName = 'layer_' + context.nameStorage.getSafeName(layer.do_objectID, layer.name);
	const layerStyle = serializeStyle(layer.style);

	const nestedLayersStyles = pipe(
		layer.layers,
		option.map(layers =>
			pipe(
				traverseArrayEither(layers, serializeLayer(context)),
				either.map(styles => styles.join('')),
			),
		),
		sequenceOptionEither,
	);

	return combineEither(
		layerStyle,
		nestedLayersStyles,
		(pageStyle, nestedPagesStyles) => `
            ${getJSDoc([...(jsdoc || []), layer.name, layer.do_objectID])}
            export const ${safeName}:  { name: string; styles: Partial<CSSStyleDeclaration> } = {
                name: '${layer.name}',
                styles: {
                    ${pageStyle}
                },
            };
            ${option.fold(constant(''), identity)(nestedPagesStyles)}
        `,
	);
});
