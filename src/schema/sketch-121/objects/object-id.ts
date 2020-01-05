import { brand, Branded, string } from 'io-ts';

const UUIDReg = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const ObjectIDReg = new RegExp(`${UUIDReg.source}(\\[${UUIDReg.source}\\])?`, 'i');

interface ObjectIDBrand {
	readonly ObjectID: unique symbol;
}
export type ObjectID = Branded<string, ObjectIDBrand>;

export const ObjectIDCodec = brand(string, (n): n is ObjectID => ObjectIDReg.test(n), 'ObjectID');
