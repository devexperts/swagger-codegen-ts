import * as yaml from 'js-yaml';

export interface JSON extends Record<string, unknown> {}
export type FileReader = (buffer: Buffer) => JSON;

export const fromJSON: FileReader = buffer => JSON.parse(buffer.toString());
export const fromYaml: FileReader = buffer => yaml.safeLoad(buffer.toString());
