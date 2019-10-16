import { string, tuple } from 'fast-check';
import { serializedDependency } from '../serialized-dependency';

export const serializedDependencyArbitrary = tuple(string(), string()).map(([name, path]) =>
	serializedDependency(name, path),
);

describe('', () => {
	it('', () => {});
});
