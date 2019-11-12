import { Ref } from '../../../../utils/ref';
import { ParameterObject } from '../../../../schema/2.0/parameter-object';
import {
	getSerializedArrayType,
	getSerializedIntegerType,
	getSerializedStringType,
	SERIALIZED_BOOLEAN_TYPE,
	SERIALIZED_NUMBER_TYPE,
	SERIALIZED_UNKNOWN_TYPE,
} from '../../common/data/serialized-type';
import { serializeItemsObject } from './items-object';
import { serializeSchemaObject } from './schema-object';
import { Either, right } from 'fp-ts/lib/Either';
import { fromSerializedType, SerializedParameter } from '../../common/data/serialized-parameter';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option } from 'fp-ts';
import { constFalse } from 'fp-ts/lib/function';
import { utilsRef } from '../../common/bundled/utils';

export const serializeParameterObject = (
	from: Ref,
	parameterObject: ParameterObject,
): Either<Error, SerializedParameter> => {
	const toSerializedParameter = fromSerializedType(isRequired(parameterObject));
	switch (parameterObject.in) {
		case 'path':
		case 'query':
		case 'header':
		case 'formData': {
			switch (parameterObject.type) {
				case 'string': {
					return right(toSerializedParameter(getSerializedStringType(parameterObject.format)));
				}
				case 'number': {
					return right(toSerializedParameter(SERIALIZED_NUMBER_TYPE));
				}
				case 'integer': {
					return pipe(
						utilsRef,
						either.map(utilsRef => toSerializedParameter(getSerializedIntegerType(from, utilsRef))),
					);
				}
				case 'boolean': {
					return right(toSerializedParameter(SERIALIZED_BOOLEAN_TYPE));
				}
				case 'array': {
					return right(
						toSerializedParameter(getSerializedArrayType()(serializeItemsObject(parameterObject.items))),
					);
				}
				case 'file':
					return right(toSerializedParameter(SERIALIZED_UNKNOWN_TYPE));
			}
		}
		case 'body': {
			return pipe(
				serializeSchemaObject(from, parameterObject.schema),
				either.map(toSerializedParameter),
			);
		}
	}
};

export const isRequired = (parameterObject: ParameterObject): boolean =>
	parameterObject.in === 'path'
		? parameterObject.required
		: pipe(
				parameterObject.required,
				option.getOrElse(constFalse),
		  );
