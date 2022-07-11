export declare const uniqString: (as: string[]) => string[];
export declare const concatIfL: <A>(condition: boolean, as: A[], a: (as: A[]) => A[]) => A[];
export declare const concatIf: <A>(condition: boolean, as: A[], a: A[]) => A[];
export declare const includes: <A>(a: A) => (as: A[]) => boolean;
export declare const join: (s: string) => <A>(as: string[]) => string;
