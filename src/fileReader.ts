import * as yaml from 'js-yaml';

export type TJSON = {
	[key: string]: unknown;
};
export type TFileReader = (buffer: Buffer) => TJSON;

export const fromJSON: TFileReader = buffer => JSON.parse(buffer.toString());
export const fromYaml: TFileReader = buffer => yaml.safeLoad(buffer.toString());
