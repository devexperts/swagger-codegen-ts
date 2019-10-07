export const unless = (condition: boolean, a: string): string => (condition ? '' : a);
export const when = (condition: boolean, a: string): string => (condition ? a : '');
