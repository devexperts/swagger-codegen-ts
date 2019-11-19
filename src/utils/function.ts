export const applyTo = <Args extends any[]>(...args: Args) => <B>(f: (...a: Args) => B): B => f(...args);

export const trace = (...args: unknown[]) => <A>(a: A): A => {
	console.log(...args, a);
	return a;
};
