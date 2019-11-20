import { SharedStyle } from '../../../../../schema/sketch-121/objects/shared-style';
import { Either } from 'fp-ts/lib/Either';
import { getJSDoc } from '../../../common/utils';
import { serializeStyle } from './style';
import { combineEither } from '@devexperts/utils/dist/adt/either.utils';
import { combineReader } from '@devexperts/utils/dist/adt/reader.utils';
import { context } from '../../utils';

export const serializeSharedStyle = combineReader(
	context,
	context => (sharedStyle: SharedStyle, jsdoc?: string[]): Either<Error, string> => {
		const style = serializeStyle(sharedStyle.value);
		const safeName = context.nameStorage.getSafeName(sharedStyle.do_objectID, sharedStyle.name);
		return combineEither(
			style,
			style => `
				${getJSDoc([...(jsdoc || []), sharedStyle.name, sharedStyle.do_objectID])}
				export const ${safeName}: Partial<CSSStyleDeclaration> = {
					${style}
				};
			`,
		);
	},
);
