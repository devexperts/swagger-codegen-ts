# API

The single entry point to the generator is the `generate` function:

```typescript
import { generate } from "@devexperts/swagger-codegen-ts";
import { OpenapiObjectCodec } from "@devexperts/swagger-codegen-ts/dist/schema/3.0/openapi-object";
import { serialize } from "@devexperts/swagger-codegen-ts/dist/language/typescript/3.0";

generate({
  spec: path.resolve(__dirname, "petstore.json"),
  out: path.resolve(__dirname, "src/generated"),
  language: serialize,
  decoder: OpenapiObjectCodec,
});
```

See the typedocs for more info about the options.

# CLI

Not implemented yet - PRs are highly welcome!
