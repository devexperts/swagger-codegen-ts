import { SerializeOptions } from '../common/utils';
import { FSEntity } from '../../../utils/fs';
import { Either } from 'fp-ts/lib/Either';
import { FileFormat } from '../../../schema/sketch-121/file-format';
export declare const serialize: import("fp-ts/lib/Reader").Reader<import("./utils").Context, (files: Record<string, FileFormat>, options?: SerializeOptions) => Either<Error, FSEntity>>;
