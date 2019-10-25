import { PathsObject } from '../../../../schema/2.0/paths-object';
import { Option } from 'fp-ts/lib/Option';
import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { directory, Directory } from '../../../../utils/fs';
import { groupPathsByTag } from '../../../../utils/utils';
import { serializePathGroup } from './path-item-object';
import { CONTROLLERS_DIRECTORY, ROOT_DIRECTORY } from '../../common/utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, record } from 'fp-ts';
import { sequenceEither } from '@devexperts/utils/dist/adt/either.utils';
import { Either } from 'fp-ts/lib/Either';

export const serializePaths = (
	paths: PathsObject,
	parameters: Option<ParametersDefinitionsObject>,
): Either<Error, Directory> =>
	pipe(
		groupPathsByTag(paths, parameters),
		record.collect((name, group) => serializePathGroup(name, group, `${ROOT_DIRECTORY}/${CONTROLLERS_DIRECTORY}`)),
		sequenceEither,
		either.map(serialized => directory(CONTROLLERS_DIRECTORY, serialized)),
	);
