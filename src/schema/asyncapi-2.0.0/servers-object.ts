import { brand, Branded, record, string } from 'io-ts';
import { ServerObject, ServerObjectCodec } from './server-object';
import { Codec } from '../../utils/io-ts';

export interface ServersObjectFieldPatternBrand {
	readonly ServersObjectFieldPattern: unique symbol;
}
export type ServersObjectPattern = Branded<string, ServersObjectFieldPatternBrand>;

const pattern = /^[A-Za-z0-9_\-]+$/;
const ServersObjectFieldPatternCodec = brand(
	string,
	(v): v is ServersObjectPattern => pattern.test(v),
	'ServersObjectFieldPattern',
);

export interface ServersObject extends Record<ServersObjectPattern, ServerObject> {}

export const ServersObjectCodec: Codec<ServersObject> = record(
	ServersObjectFieldPatternCodec,
	ServerObjectCodec,
	'ServersObject',
);
