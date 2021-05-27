# Using the generated code

> The examples below refer to the [Pet Store OpenAPI 3.0 schema](https://petstore3.swagger.io/).

## Basic example: using a single controller

In the most basic scenario, you may need just a single **controller** from the generated code. In this case, the code is as simple as this:

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

## The `controllers` object

In most projects, the generated code includes more than one controller. Sometimes it's handy to have a single entry points to all of them - for this purpose, the `controllers` object is created by the generator:

```typescript
import { controllers } from "./src/generated/petstore.json/paths/paths";

const api = controllers({ httpClient: fetchHttpClient });
const pets = api.petController.findPetsByStatus({
  query: { status: some("available") },
});
// api.userController and api.storeController are also available
```

## Plugging different HTTP clients

Generated functions may be instructed to return any generic type with one or two type arguments, for example `Promise<Response>` or `Observable<Either<Error, Response>>`. The return type is specified by providing a corresponding **client**. In the example below, providing an `rxjsHttpClient` makes the `petController` return RxJS's `Observable`:

```typescript
import { Observable } from "rxjs";

// Now create another controller returning an RxJS stream
const petRxjsController = createPetController({ httpClient: rxjsHttpClient });
const createdPet$: Observable<Pet> = petRxjsController.addPet({
  body: {
    name: "Spotty",
    photoUrls: [],
  },
});
```

The list of bundled clients and more information can be found in the [Clients](./clients.md) page.

## Using [`RemoteData`](https://github.com/devexperts/remote-data-ts)

The codegen provides first class support for the `RemoteData<Error, Response>` type, making it easier to build complex logic on top of the generated controllers.

```typescript
const petRDController = createPetController({ httpClient: liveDataHttpClient });
/**
 * `LiveData<E, A> = Observable<RemoteData<E, A>>`
 *
 * Emits `pending` when the request is started,
 * then `success(Pet)` or `failure(Error)` upon completion.
 */
const createdPet$: LiveData<Error, Pet> = petRDController.addPet({
  body: {
    name: "Spotty",
    photoUrls: [],
  },
});
```

## Validation utils

Each schema defined in the spec produces a TS type and an `io-ts` codec, which can be used for runtime type checking in the application code:

```typescript
import { either } from "fp-ts";
import { pipe } from "fp-ts/function";
import { User, UserIO } from "./src/generated/petstore.json/components/schemas/User";

pipe(
    UserIO.decode(JSON.parse(localStorage.getItem('PetStore.user'))),
    either.fold(
        error => {
            console.log('The user record is not valid');
        },
        (user: User) => {
            console.log(`Was previously logged in as: ${user.email}`);
        }
    )
);
```

Learn more on the `Either` type: [Getting started with fp-ts: Either vs Validation](https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja)

