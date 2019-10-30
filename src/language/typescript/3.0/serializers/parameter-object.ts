import { fromSerializedType, SerializedParameter } from '../../common/data/serialized-parameter';
import { Either } from 'fp-ts/lib/Either';
import { serializeSchemaObject } from './schema-object';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { getSerializedRefType } from '../../common/data/serialized-type';
import { fromString, Ref } from '../../../../utils/ref';
import { ParameterObject } from '../../../../schema/3.0/parameter-object';
import { ReferenceObjectCodec } from '../../../../schema/3.0/reference-object';
import { constFalse } from 'fp-ts/lib/function';

const forParameter = (parameter: ParameterObject): string => `for parameter "${parameter.name}" in "${parameter.in}"`;

export const isRequired = (parameter: ParameterObject): boolean =>
	parameter.in === 'path'
		? parameter.required
		: pipe(
				parameter.required,
				option.getOrElse(constFalse),
		  );

export const serializeParameterObject = (
	from: Ref,
	parameterObject: ParameterObject,
): Either<Error, SerializedParameter> =>
	pipe(
		parameterObject.schema,
		option.alt(() =>
			pipe(
				parameterObject.content,
				option.chain(content => record.lookup('application/json', content)),
				option.chain(media => media.schema),
			),
		),
		either.fromOption(() => new Error(`Unable to get schema ${forParameter(parameterObject)}`)),
		either.chain(schema => {
			if (ReferenceObjectCodec.is(schema)) {
				return pipe(
					fromString(schema.$ref),
					either.map(getSerializedRefType(from)),
				);
			} else {
				return pipe(
					schema,
					serializeSchemaObject(from),
				);
			}
		}),
		either.map(fromSerializedType(isRequired(parameterObject))),
	);
