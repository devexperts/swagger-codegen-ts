import { ItemsObject } from '../../../../schema/2.0/items-object';
import {
	getSerializedArrayType,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_NUMERIC_TYPE,
	SERIALIZED_STRING_TYPE,
	SerializedType,
} from '../../common/data/serialized-type';

export const serializeItemsObject = (itemsObject: ItemsObject): SerializedType => {
	switch (itemsObject.type) {
		case 'array': {
			return getSerializedArrayType()(serializeItemsObject(itemsObject.items));
		}
		case 'string': {
			return SERIALIZED_STRING_TYPE;
		}
		case 'number':
		case 'integer': {
			return SERIALIZED_NUMERIC_TYPE;
		}
		case 'boolean': {
			return SERIALIZED_BOOLEAN_TYPE;
		}
	}
};
