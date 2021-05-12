import { format } from 'prettier';
import { SerializedType } from '../src/language/typescript/common/data/serialized-type';
import { ordRefByPath } from '../src/utils/ref';
import { array } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { ordDependencyByName, ordDependencyByPath } from '../src/language/typescript/common/data/serialized-dependency';

export const normalizeCodeSnippet = (code: string) => format(code, { parser: 'typescript' });

export const normalizeType = (t: SerializedType): SerializedType => ({
	refs: pipe(t.refs, array.sort(ordRefByPath)),
	dependencies: pipe(t.dependencies, array.sortBy([ordDependencyByPath, ordDependencyByName])),
	io: normalizeCodeSnippet(t.io),
	type: normalizeCodeSnippet(t.type),
});
