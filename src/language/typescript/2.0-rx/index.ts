import { SwaggerObject } from '../../../schema/2.0/swagger-object';
import { defaultPrettierConfig, SerializeOptions } from '../common/utils';
import { directory, FSEntity, map } from '../../../utils/fs';
import { Dictionary } from '../../../utils/types';
import { record } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { serializeSwaggerObject } from './serializers/swagger-object';
import { format } from 'prettier';

export const serialize = (
	out: string,
	documents: Dictionary<SwaggerObject>,
	options: SerializeOptions = {},
): FSEntity => {
	const serialized = pipe(
		documents,
		record.collect(serializeSwaggerObject),
	);
	return map(directory(out, serialized), content => format(content, options.prettierConfig || defaultPrettierConfig));
};
