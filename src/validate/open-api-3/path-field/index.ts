import { brand, Branded, string, Type } from 'io-ts';

// https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#pathsObject
const regex = /^\/.+$/;

export interface PathFieldBrand {
	readonly PathField: unique symbol;
}

export type PathField = Branded<string, PathFieldBrand>;

export interface PathFieldC extends Type<PathField, string, unknown> {}

export const pathField: PathFieldC = brand(string, (s): s is PathField => regex.test(s), 'PathField');
