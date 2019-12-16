import { Layer } from '../../../../../schema/sketch-121/pages/layer';
import { Either } from 'fp-ts/lib/Either';
import { getJSDoc } from '../../../common/utils';
import { serializeStyle } from '../objects/style';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { context } from '../../utils';
import { option, either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { traverseArrayEither, traverseOptionEither } from '../../../../../utils/either';
import { identity, constant } from 'fp-ts/lib/function';

export const serializeLayer = combineReader(context, context => (layer: Layer, jsdoc?: string[]): Either<
	Error,
	string
> => {
	const layerNameWithPrefix = `layer_${layer.name}`;
	const safeName = context.nameStorage.getSafeName(layer.do_objectID, layerNameWithPrefix);
	const layerStyle = serializeStyle(layer.style);

	const nestedLayersStyles = traverseOptionEither(layer.layers, layers =>
		pipe(
			traverseArrayEither(layers, serializeLayer(context)),
			either.map(styles => styles.join('')),
		),
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
