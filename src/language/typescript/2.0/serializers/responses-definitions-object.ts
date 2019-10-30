import { getIOName, getTypeName } from '../../common/utils';
import { addPathParts, Ref } from '../../../../utils/ref';
import { ResponsesDefinitionsObject } from '../../../../schema/2.0/responses-definitions-object';
import { Either, right } from 'fp-ts/lib/Either';
import { directory, file, FSEntity } from '../../../../utils/fs';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, option, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { ResponseObject } from '../../../../schema/2.0/response-object';
import { serializeResponseObject } from './response-object';
import { SERIALIZED_VOID_TYPE } from '../../common/data/serialized-type';
import { serializeDependencies } from '../../common/data/serialized-dependency';

export const serializeResponsesDefinitionsObject = (
	from: Ref,
	responsesDefinitionsObject: ResponsesDefinitionsObject,
): Either<Error, FSEntity> =>
	pipe(
		responsesDefinitionsObject,
		record.collect((name, parameterObject) =>
			pipe(
				from,
				addPathParts(name),
				either.chain(from => serializeResponse(from, parameterObject)),
			),
		),
		sequenceEither,
		either.map(content => directory('responses', content)),
	);

const serializeResponse = (from: Ref, responseObject: ResponseObject): Either<Error, FSEntity> =>
	pipe(
		serializeResponseObject(from, responseObject),
		option.getOrElse(() => right(SERIALIZED_VOID_TYPE)),
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
