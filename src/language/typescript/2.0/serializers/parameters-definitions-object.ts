import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { Either } from 'fp-ts/lib/Either';
import { directory, file, FSEntity } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { ParameterObject } from '../../../../schema/2.0/parameter-object';
import { addPathParts, Ref } from '../../../../utils/ref';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { serializeParameterObject } from './parameter-object';
import { makeNormalizedName } from '../../common/normalized-name';
import { getFileName, getTypeFileContent } from '../../common/utils';

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
			const normalizedName = makeNormalizedName(from.name);
			return file(getFileName(normalizedName), getTypeFileContent(normalizedName, serialized));
		}),
	);
