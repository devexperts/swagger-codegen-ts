# Typesafe OpenAPI generator for TypeScript

![](https://img.shields.io/npm/v/@devexperts/swagger-codegen-ts)

## Features
* Generates client code from **OpenAPI 3.0, 2.0** (aka Swagger) and **AsyncAPI** specs
* **Pluggable HTTP clients:** can use `fetch`, `Axios` or any other library
* **Flexible response types:** works with Promises and reactive streams like RxJS
* **Runtime type checks:** validates server responses against the spec
* Written in **pure TypeScript** using [`fp-ts`](https://github.com/gcanti/fp-ts) and [`io-ts`](https://github.com/gcanti/io-ts) libraries

## Demo code

> The examples below refer to the [Pet Store OpenAPI 3.0 schema](https://petstore3.swagger.io/).

After running the codegen, interacting with a REST API may be as simple as this:

```typescript
import { petController as createPetController } from "./src/generated/petstore.json/paths/PetController";
import { Pet } from "./src/generated/petstore.json/components/schemas/Pet";

// Creating a controller, see the "HTTP Clients" wiki page for more details
const petController = createPetController({ httpClient: fetchHttpClient });

// The returned object is guaranteed to be a valid `Pet`
const createdPet: Promise<Pet> = petController.addPet({
  body: {
    // The parameters are statically typed, IntelliSense works, too
    name: "Spotty",
    photoUrls: [],
  },
});
```

More usage scenarios are supported - check the [usage page](./docs/usage/generated-code.md) for more detail.

## Installation

1. Make sure the peer dependencies are installed, then install the codegen itself:
   ```
   yarn add typescript fp-ts io-ts io-ts-types
   yarn add -D @devexperts/swagger-codegen-ts
   ```

2. Create a console script that would invoke the `generate` function, passing the options such as path to the schema file and the output directory.
See the [Generators](docs/usage/api.md) page for the API reference, and [examples/generate](examples/generate) for sample scripts.

3. In most cases, you might want to include the code generation step into the build and local launch scripts. Example:
   ```diff
   /* package.json */

     "scripts": {
   +   "generate:api": "ts-node scripts/generate-api.ts",
   -   "start": "react-scripts start",
   +   "start": "yarn generate:api && react-scripts start",
   -   "build": "react-scripts build"
   +   "build": "yarn generate:api && react-scripts build"
     }
   ```

## Contributing

* Feel free to file bugs and feature requests in [GitHub issues](https://github.com/devexperts/swagger-codegen-ts/issues/new).
* Pull requests are welcome - please use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

Please read the [Contributors Guide](./docs/development/contributors-guide.md) for more information.
