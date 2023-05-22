export interface NameStorage {
    readonly getSafeName: (uuid: string, name: string) => string;
}
export declare const createNameStorage: () => {
    getSafeName: (uuid: string, name: string) => string;
};
export interface Context {
    readonly nameStorage: NameStorage;
}
export declare const context: import("fp-ts/lib/Reader").Reader<Context, Context>;
