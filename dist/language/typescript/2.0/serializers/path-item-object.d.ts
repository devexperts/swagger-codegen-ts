import { PathItemObject } from '../../../../schema/2.0/path-item-object';
import { Option } from 'fp-ts/lib/Option';
import { Dictionary } from '../../../../utils/types';
import { File } from '../../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { ResolveRefContext, Ref } from '../../../../utils/ref';
export declare const serializePathGroup: import("fp-ts/lib/Reader").Reader<ResolveRefContext, (from: Ref<string>, name: string, group: Dictionary<PathItemObject>) => Either<Error, File>>;
export declare const getTagsFromPath: (path: PathItemObject) => string[];
export declare const serializePathItemObjectTags: (pathItemObject: PathItemObject) => Option<string>;
