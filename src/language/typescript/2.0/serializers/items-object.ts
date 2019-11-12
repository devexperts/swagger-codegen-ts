import { ItemsObject } from '../../../../schema/2.0/items-object';
import {
	getSerializedArrayType,
	getSerializedIntegerType,
	getSerializedStringType,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_NUMBER_TYPE,
	SerializedType,
} from '../../common/data/serialized-type';
import { Ref } from '../../../../utils/ref';
import { utilsRef } from '../../common/bundled/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { Either, right } from 'fp-ts/lib/Either';

export const serializeItemsObject = (from: Ref, itemsObject: ItemsObject): Either<Error, SerializedType> => {
	switch (itemsObject.type) {
		case 'array': {
			return pipe(
				serializeItemsObject(from, itemsObject.items),
				either.map(getSerializedArrayType()),
			);
		}
		case 'string': {
			return right(getSerializedStringType(itemsObject.format));
		}
		case 'number': {
			return right(SERIALIZED_NUMBER_TYPE);
		}
		case 'integer': {
			return pipe(
				utilsRef,
				either.map(utilsRef => getSerializedIntegerType(from, utilsRef)),
			);
		}
		case 'boolean': {
			return right(SERIALIZED_BOOLEAN_TYPE);
		}
	}
};
