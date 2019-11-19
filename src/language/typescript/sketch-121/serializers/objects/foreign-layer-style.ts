import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeSharedStyle } from './shared-style';
import { ForeignLayerStyle } from '../../../../../schema/sketch-121/objects/foreign-layer-style';
import { Either } from 'fp-ts/lib/Either';

export const serializeForeignLayerStyle = combineReader(
	serializeSharedStyle,
	serializeSharedStyle => (style: ForeignLayerStyle): Either<Error, string> =>
		serializeSharedStyle(style.localSharedStyle, [style.sourceLibraryName]),
);
