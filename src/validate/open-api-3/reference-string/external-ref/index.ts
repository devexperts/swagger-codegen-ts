import { brand, Branded, string, Type } from 'io-ts';

// https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03
const regex = /^((\.\/)+|(\.\.\/)+)(\w+\/)*(\w+\.\w+)#(\/\w+)+$/;

interface ExternalRefBrand {
	readonly ExternalRef: unique symbol;
}

export type ExternalRef = Branded<string, ExternalRefBrand>;

export interface ExternalRefC extends Type<ExternalRef, string, unknown> {}

const typeGuard = (s: string): s is ExternalRef => regex.test(s);

export const externalRefIO: ExternalRefC = brand(string, typeGuard, 'ExternalRef');
