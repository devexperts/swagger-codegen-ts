import { Decoder } from 'io-ts';
import { FSEntity } from './utils/fs';
import { taskEither } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { ResolveRefContext } from './utils/ref';
import { Reader } from 'fp-ts/lib/Reader';
export interface Language<A> {
    (documents: Record<string, A>): Either<unknown, FSEntity>;
}
export interface GenerateOptions<A> {
    /**
     * Base directory for the generation task.
     * Relative paths provided in the `out` and `spec` options are resolved relative to this path.
     * @default current working directory
     */
    readonly cwd?: string;
    /**
     * Path to the output files.
     * Relative paths are resolved relative to `cwd`.
     */
    readonly out: string;
    /**
     * Path to the source schema.
     * Supports local files and remote URLs, YAML and JSON formats.
     * Relative paths are resolved relative to `cwd`
     */
    readonly spec: string;
    /**
     * The `decoder` is used to parse the specification file. In most cases, one of the following decoders should be
     * chosen depending on the source format:
     * - `SwaggerObject`
     * - `OpenapiObjectCodec`
     * - `AsyncAPIObjectCodec`
     */
    readonly decoder: Decoder<unknown, A>;
    /**
     * The `language` implements the generation of the code from the intermediate format `A` into actual
     * file system objects. Most users should import one of the predefined languages:
     * - `import { serialize as serializeSwagger2 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/2.0'`
     * - `import { serialize as serializeOpenAPI3 } from '@devexperts/swagger-codegen-ts/dist/language/typescript/3.0'`
     * - `import { serialize as serializeAsyncAPI } from '@devexperts/swagger-codegen-ts/dist/language/typescript/asyncapi-2.0.0'`
     */
    readonly language: Reader<ResolveRefContext, Language<A>>;
}
export declare const generate: <A>(options: GenerateOptions<A>) => taskEither.TaskEither<unknown, void>;
