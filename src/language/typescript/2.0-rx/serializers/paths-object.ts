import { PathsObject } from '../../../../schema/2.0/paths-object';
import { Option } from 'fp-ts/lib/Option';
import { ParametersDefinitionsObject } from '../../../../schema/2.0/parameters-definitions-object';
import { directory, Directory } from '../../../../fs';
import { serializeDictionary } from '../../../../utils/types';
import { groupPathsByTag } from '../../../../utils';
import { serializePathGroup } from './path-item-object';
import { CONTROLLERS_DIRECTORY, ROOT_DIRECTORY } from '../../common/utils';

export const serializePaths = (paths: PathsObject, parameters: Option<ParametersDefinitionsObject>): Directory =>
	directory(
		CONTROLLERS_DIRECTORY,
		serializeDictionary(groupPathsByTag(paths, parameters), (name, group) =>
			serializePathGroup(name, group, `${ROOT_DIRECTORY}/${CONTROLLERS_DIRECTORY}`),
		),
	);
