export declare const applyTo: <Args extends any[]>(...args: Args) => <B>(f: (...a: Args) => B) => B;
export declare const trace: (...args: unknown[]) => <A>(a: A) => A;
