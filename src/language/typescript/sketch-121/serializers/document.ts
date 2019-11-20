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
import { file, fragment, FSEntity } from '../../../../utils/fs';

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
	) => (document: Document): Either<Error, Option<FSEntity>> => {
		const layerStyles = pipe(
			serializeSharedStyleContainer(document.layerStyles),
			either.map(option.map(content => file('layer-styles.ts', content))),
		);
		const layerTextStyles = pipe(
			serializeSharedTextStyleContainer(document.layerTextStyles),
			either.map(option.map(content => file('layer-text-styles.ts', content))),
		);

		const foreignLayerStyles = pipe(
			nonEmptyArray.fromArray(document.foreignLayerStyles),
			option.map(styles =>
				pipe(
					traverseNEAEither(styles, serializeForeignLayerStyle),
					either.map(styles => file('foreign-layer-styles.ts', styles.join(''))),
				),
			),
			sequenceOptionEither,
		);
		const foreignTextStyles = pipe(
			nonEmptyArray.fromArray(document.foreignTextStyles),
			option.map(styles =>
				pipe(
					traverseNEAEither(styles, serializeForeignTextStyle),
					either.map(styles => file('foreign-text-styles.ts', styles.join(''))),
				),
			),
			sequenceOptionEither,
		);

		return combineEither(
			layerStyles,
			layerTextStyles,
			foreignLayerStyles,
			foreignTextStyles,
			(layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles) =>
				pipe(
					nonEmptyArray.fromArray(
						array.compact([layerStyles, layerTextStyles, foreignLayerStyles, foreignTextStyles]),
					),
					option.map(fragment),
				),
		);
	},
);
