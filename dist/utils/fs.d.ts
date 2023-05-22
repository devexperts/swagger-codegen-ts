import { Ref } from './ref';
export interface File {
    readonly type: 'FILE';
    readonly name: string;
    readonly content: string;
}
export declare const file: (name: string, content: string) => File;
export interface Directory {
    readonly type: 'DIRECTORY';
    readonly name: string;
    readonly content: FSEntity[];
}
export declare const directory: (name: string, content: FSEntity[]) => Directory;
export interface Fragment {
    readonly type: 'FRAGMENT';
    readonly content: FSEntity[];
}
export declare const fragment: (content: FSEntity[]) => Fragment;
export declare type FSEntity = File | Directory | Fragment;
export declare const write: (destination: string, entity: FSEntity) => Promise<void>;
export declare const map: (entity: FSEntity, f: (content: string) => string) => FSEntity;
export declare const fromRef: (ref: Ref<string>, extname: string, content: string) => FSEntity;
