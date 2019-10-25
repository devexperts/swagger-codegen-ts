import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const unless = (condition: boolean, a: string): string => (condition ? '' : a);
export const when = (condition: boolean, a: string): string => (condition ? a : '');
export const before = (symbol: string) => (path: string): string => {
	const index = path.indexOf(symbol);
	if (index >= 0) {
		return path.substr(0, index);
	}
	return path;
};
export const trim = (s: string): string => s.trim();
export const split = (symbol: string) => (s: string): NonEmptyArray<string> => s.split(symbol) as any;
