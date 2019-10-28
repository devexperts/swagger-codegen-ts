import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { Either } from 'fp-ts/lib/Either';
import { directory, file, FSEntity } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { ParameterObject } from '../../../../schema/2.0/parameter-object';
import { addPathParts, Ref } from '../../../../utils/ref';
import { serializeDependencies } from '../../common/data/serialized-dependency';
import { getIOName, getTypeName } from '../../common/utils';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { serializeParameterObject } from './parameter-object';

export const serializeParametersDefinitionsObject = (
	from: Ref,
	parametersDefinitionsObject: ParametersDefinitionsObject,
): Either<Error, FSEntity> =>
	pipe(
		parametersDefinitionsObject,
		record.collect((name, parameterObject) =>
			pipe(
				from,
				addPathParts(name),
				either.chain(from => serializeParameter(from, parameterObject)),
			),
		),
		sequenceEither,
		either.map(content => directory('parameters', content)),
	);

const serializeParameter = (from: Ref, parameterObject: ParameterObject): Either<Error, FSEntity> =>
	pipe(
		serializeParameterObject(from, parameterObject),
		either.map(serialized => {
			const dependencies = serializeDependencies(serialized.dependencies);
			return file(
				`${from.name}.ts`,
				`
					${dependencies}
					
					export type ${getTypeName(from.name)} = ${serialized.type};
					export const ${getIOName(from.name)} = ${serialized.io};
				`,
			);
		}),
	);
