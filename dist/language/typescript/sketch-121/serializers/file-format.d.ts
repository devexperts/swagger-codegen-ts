import { FileFormat } from '../../../../schema/sketch-121/file-format';
import { Either } from 'fp-ts/lib/Either';
import { FSEntity } from '../../../../utils/fs';
import { option } from 'fp-ts';
export declare const serializeFileFormat: import("fp-ts/lib/Reader").Reader<import("../utils").Context, (fileFormat: FileFormat) => Either<Error, option.Option<FSEntity>>>;
