import { FileInfo } from 'json-schema-ref-parser';
export declare const sketchParser121: {
    order: number;
    allowEmpty: boolean;
    canParse: (file: FileInfo) => boolean;
    parse: (file: FileInfo) => Promise<unknown>;
};
