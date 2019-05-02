import { brand, Branded, string, Type } from 'io-ts';

// https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
const regex = /^#(\/\w+)+$/;

interface InternalRefBrand {
	readonly InternalRef: unique symbol;
}

export type InternalRef = Branded<string, InternalRefBrand>;

export interface InternalRefC extends Type<InternalRef, string, unknown> {}

const typeGuard = (s: string): s is InternalRef => regex.test(s);

export const internalRefIO: InternalRefC = brand(string, typeGuard, 'InternalRef');
