import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { serializeSharedStyle } from './shared-style';
import { Either } from 'fp-ts/lib/Either';
import { ForeignTextStyle } from '../../../../../schema/sketch-121/objects/foreign-text-style';

export const serializeForeignTextStyle = combineReader(
	serializeSharedStyle,
	serializeSharedStyle => (style: ForeignTextStyle): Either<Error, string> =>
		serializeSharedStyle(style.localSharedStyle, [style.sourceLibraryName]),
);
