export const applyTo = <Args extends any[]>(...args: Args) => <B>(f: (...a: Args) => B): B => f(...args);
