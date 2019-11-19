import { Either } from 'fp-ts/lib/Either';
import { Document } from '../../../../schema/sketch-121/document';
import { serializeSharedStyleContainer } from './objects/shared-styled-container';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either, nonEmptyArray, option } from 'fp-ts';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeSharedTextStyleContainer } from './objects/shared-text-style-container';
import { serializeForeignLayerStyle } from './objects/foreign-layer-style';
import { traverseNEAEither } from '../../../../utils/either';
import { sequenceOptionEither } from '../../../../utils/option';
import { serializeForeignTextStyle } from './objects/foreign-text-style';
import { Option } from 'fp-ts/lib/Option';

export const serializeDocument = combineReader(
	serializeSharedStyleContainer,
	serializeSharedTextStyleContainer,
	serializeForeignLayerStyle,
	serializeForeignTextStyle,
	(
		serializeSharedStyleContainer,
		serializeSharedTextStyleContainer,
		serializeForeignLayerStyle,
		serializeForeignTextStyle,
	) => (document: Document): Either<Error, Option<string>> => {
		const layerStyles = pipe(
			serializeSharedStyleContainer(document.layerStyles),
			either.map(
				option.map(
					styles => `
						//#region Layer Styles
						${styles}
						//#endregion
					`,
				),
			),
		);
		const layerTextStyles = pipe(
			serializeSharedTextStyleContainer(document.layerTextStyles),
			either.map(
				option.map(
					styles => `
						//#region Layer Text Styles
						${styles}
						//#endregion
					`,
				),
			),
		);

		const foreignLayerStyles = pipe(
			nonEmptyArray.fromArray(document.foreignLayerStyles),
			option.map(styles =>
				pipe(
					traverseNEAEither(styles, serializeForeignLayerStyle),
					either.map(
						styles => `
							//#region Foreign Layer Styles
							${styles.join('')}
							//#endregion
						`,
					),
				),
			),
			sequenceOptionEither,
		);
		const foreignTextStyles = pipe(
			nonEmptyArray.fromArray(document.foreignTextStyles),
			option.map(styles =>
				pipe(
					traverseNEAEither(styles, serializeForeignTextStyle),
					either.map(
						styles => `
							//#region Foreign Text Styles
							${styles.join('')}
							//#endregion
						`,
					),
				),
			),
			sequenceOptionEither,
		);

		return combineEither(
			layerStyles,
			layerTextStyles,
			foreignLayerStyles,
			foreignTextStyles,
			(layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles) => {
				return pipe(
					nonEmptyArray.fromArray(
						array.compact([layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles]),
					),
					option.map(content => content.join('')),
				);
			},
		);
	},
);
