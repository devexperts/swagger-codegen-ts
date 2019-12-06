# [2.0.0-alpha.9](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2019-12-06)


### Bug Fixes

* fix encodeURIComponent in query serialization ([d7229d3](https://github.com/devexperts/swagger-codegen-ts/commit/d7229d3))



# [2.0.0-alpha.8](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2019-12-05)


### Bug Fixes

* fix encodeURIComponent in query serialization ([08a6ed0](https://github.com/devexperts/swagger-codegen-ts/commit/08a6ed0))



# [2.0.0-alpha.7](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2019-12-04)


### Code Refactoring

* use Integer type from io-ts ([#84](https://github.com/devexperts/swagger-codegen-ts/issues/84)) ([d63fd60](https://github.com/devexperts/swagger-codegen-ts/commit/d63fd60))


### Features

* implement support of kebab case in property names ([#83](https://github.com/devexperts/swagger-codegen-ts/issues/83)) ([ff937aa](https://github.com/devexperts/swagger-codegen-ts/commit/ff937aa)), closes [#82](https://github.com/devexperts/swagger-codegen-ts/issues/82)


### BREAKING CHANGES

* removed empty utils file



# [2.0.0-alpha.6](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2019-11-26)


### Bug Fixes

* support windows os environment ([3ef7cb0](https://github.com/devexperts/swagger-codegen-ts/commit/3ef7cb0))


### Features

* sketch file format ([51fa6c6](https://github.com/devexperts/swagger-codegen-ts/commit/51fa6c6)), closes [#76](https://github.com/devexperts/swagger-codegen-ts/issues/76)
* type codec names for swagger 2.0 ([652f864](https://github.com/devexperts/swagger-codegen-ts/commit/652f864))



# [2.0.0-alpha.5](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2019-11-15)


### Features

* query serialization support in swagger-2 and openapi-3 ([3203a63](https://github.com/devexperts/swagger-codegen-ts/commit/3203a63)), closes [#74](https://github.com/devexperts/swagger-codegen-ts/issues/74)
* support format in primitive parameters in typescript-swagger-2 ([cf5cb6a](https://github.com/devexperts/swagger-codegen-ts/commit/cf5cb6a))


### BREAKING CHANGES

* operations now always treat query/body parameters as Option (no ?:)
* HTTPClient.request now receives query already serialized to string according to spec
* ArrayQueryParameterObject.items.type should be a primitive
* SerializedType/SerialiedFragment/SerializedParameter now filter out repeating dependencies and refs on construction
* operations now require format types (Integer, Date etc.)



# [2.0.0-alpha.4](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2019-11-11)


### Code Refactoring

* rename ReferenceObject codec to ReferenceObjectCodec ([bdda8e2](https://github.com/devexperts/swagger-codegen-ts/commit/bdda8e2))
* update SchemaObject ([0b4cf16](https://github.com/devexperts/swagger-codegen-ts/commit/0b4cf16))
* update SchemaObject ([58ea69d](https://github.com/devexperts/swagger-codegen-ts/commit/58ea69d))


### Features

* add branded numeric types and codecs ([7739952](https://github.com/devexperts/swagger-codegen-ts/commit/7739952))
* asyncapi shema ([5fc7b84](https://github.com/devexperts/swagger-codegen-ts/commit/5fc7b84))
* full enum support ([21a6b8c](https://github.com/devexperts/swagger-codegen-ts/commit/21a6b8c))
* oneOf support for typescript openapi 3 ([f9e2ab5](https://github.com/devexperts/swagger-codegen-ts/commit/f9e2ab5))
* support Data Type Format in SchemaObject ([d8bc635](https://github.com/devexperts/swagger-codegen-ts/commit/d8bc635))
* support ws channel bindings ([dab6d10](https://github.com/devexperts/swagger-codegen-ts/commit/dab6d10)), closes [#68](https://github.com/devexperts/swagger-codegen-ts/issues/68)


### BREAKING CHANGES

* IntegerSchemaObject now emits `Integer` type and `integer` codec from utils
* SchemaObject.format was moved to PrimitiveSchemaObject.format
* SchemaObject codec and interfaces were renamed
* EnumSchemaObject type was added to SchemaObject
* ReferenceObject was renamed to ReferenceObjectCodec
* some codecs were renamed and moved
* OneOfSchemaObject type was added to SchemaObject
* Fragment type was added to FSEntity



# [2.0.0-alpha.3](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2019-11-06)


### Bug Fixes

* fix recursive allOf ([ff6a181](https://github.com/devexperts/swagger-codegen-ts/commit/ff6a181))
* fix recursive SchemaObject in typescript 2 ([8ab9fc0](https://github.com/devexperts/swagger-codegen-ts/commit/8ab9fc0))


### Features

* full $ref support for typescript-3 ([e95c7fd](https://github.com/devexperts/swagger-codegen-ts/commit/e95c7fd))


### BREAKING CHANGES

* SchemaObject codec was renamed to SchemaObjectCodec



# [2.0.0-alpha.2](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2019-10-31)


### Code Refactoring

* rename languages ([bb53cc7](https://github.com/devexperts/swagger-codegen-ts/commit/bb53cc7))


### Features

* abstract from data structure in client ([f33b5f5](https://github.com/devexperts/swagger-codegen-ts/commit/f33b5f5)), closes [#48](https://github.com/devexperts/swagger-codegen-ts/issues/48)


### BREAKING CHANGES

* 2.0-rx was renamed to 2.0, 3.0-rx was renamed to 3.0
* apiClient dependency was renamed to httpClient
* APIClient was renamed to HTTPClient<F> and now extends MonadThrow<F>
* FullAPIRequest/APIRequest were joined and renamed to Request



# [2.0.0-alpha.1](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2019-10-29)


### Features

* full $ref support for typescript 2 ([#58](https://github.com/devexperts/swagger-codegen-ts/issues/58)) ([9aa17b5](https://github.com/devexperts/swagger-codegen-ts/commit/9aa17b5)), closes [#46](https://github.com/devexperts/swagger-codegen-ts/issues/46)
* Openapi 3.0 ([#51](https://github.com/devexperts/swagger-codegen-ts/issues/51)) ([fe3face](https://github.com/devexperts/swagger-codegen-ts/commit/fe3face)), closes [#3](https://github.com/devexperts/swagger-codegen-ts/issues/3)


### BREAKING CHANGES

* SchemaObject codecs were changed
* rootName/cwd was replaced with Ref
* typescript 2.0 utils module was removed
* output `utils` module was removed
* all ts2 utils were moved to ts2 language
* swagger2.0 spec was changed
* API signatures as well as language signatures were changed
* a lot of other breaking changes, see #51 



# [2.0.0-alpha.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.7.0...v2.0.0-alpha.0) (2019-10-22)


### Code Refactoring

* make interface fields readonly ([4aec16b](https://github.com/devexperts/swagger-codegen-ts/commit/4aec16b))
* move schema ([78d6513](https://github.com/devexperts/swagger-codegen-ts/commit/78d6513))
* remove `T` symbol from types ([b4ef46c](https://github.com/devexperts/swagger-codegen-ts/commit/b4ef46c))
* split typescript language ([2a82892](https://github.com/devexperts/swagger-codegen-ts/commit/2a82892))


### Features

* fp-ts@2 ([fb0a3a2](https://github.com/devexperts/swagger-codegen-ts/commit/fb0a3a2))


### BREAKING CHANGES

* typescript template was moved to `typescript/2.0-rx/index.ts`
* interface fields were made readonly
* `T` symbol was removed from types
* schema was moved to separate directory



# [0.7.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.6.1...v0.7.0) (2019-09-02)


### Features

* error reporting improvement ([#35](https://github.com/devexperts/swagger-codegen-ts/issues/35)) ([4992d39](https://github.com/devexperts/swagger-codegen-ts/commit/4992d39))


### BREAKING CHANGES

* ReportValidationError message format has been changed



## [0.6.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.6.0...v0.6.1) (2019-07-27)


### Bug Fixes

* support enums with single value ([#33](https://github.com/devexperts/swagger-codegen-ts/issues/33)) ([#34](https://github.com/devexperts/swagger-codegen-ts/issues/34)) ([98000b4](https://github.com/devexperts/swagger-codegen-ts/commit/98000b4))



# [0.6.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.5.0...v0.6.0) (2019-05-14)


### Bug Fixes

* misspelled for class name ResponseValidationError ([9f5e99e](https://github.com/devexperts/swagger-codegen-ts/commit/9f5e99e))


### BREAKING CHANGES

* generated class name changed to ResponseValidationError



# [0.5.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.3...v0.5.0) (2019-02-19)


### Bug Fixes

* make fp-ts, io-ts and remote-data to be peer dependencies ([#29](https://github.com/devexperts/swagger-codegen-ts/issues/29)) ([988212b](https://github.com/devexperts/swagger-codegen-ts/commit/988212b))


### BREAKING CHANGES

* listed dependencies were moved to peerDependencies



## [0.4.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.2...v0.4.3) (2019-02-15)


### Bug Fixes

* Ability to use cusom serializer. Solves [#26](https://github.com/devexperts/swagger-codegen-ts/issues/26) ([#27](https://github.com/devexperts/swagger-codegen-ts/issues/27)) ([a76be11](https://github.com/devexperts/swagger-codegen-ts/commit/a76be11))
* Consider HTTP201 to be successful code ([#28](https://github.com/devexperts/swagger-codegen-ts/issues/28)) ([b19b33d](https://github.com/devexperts/swagger-codegen-ts/commit/b19b33d))



## [0.4.2](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.1...v0.4.2) (2019-02-14)


### Bug Fixes

* lock fp-ts and io-ts minor versions ([#25](https://github.com/devexperts/swagger-codegen-ts/issues/25)) ([438067a](https://github.com/devexperts/swagger-codegen-ts/commit/438067a))
* tag parameters fix ([#23](https://github.com/devexperts/swagger-codegen-ts/issues/23)) ([348058e](https://github.com/devexperts/swagger-codegen-ts/commit/348058e)), closes [#17](https://github.com/devexperts/swagger-codegen-ts/issues/17)



## [0.4.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.0...v0.4.1) (2018-12-14)


### Bug Fixes

* fix non-recursive with $ref to the same file and same name ([#13](https://github.com/devexperts/swagger-codegen-ts/issues/13)) ([eaa7a4b](https://github.com/devexperts/swagger-codegen-ts/commit/eaa7a4b))



# [0.4.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.7...v0.4.0) (2018-12-14)


### Features

* add alOff support ([6f1989b](https://github.com/devexperts/swagger-codegen-ts/commit/6f1989b)), closes [#11](https://github.com/devexperts/swagger-codegen-ts/issues/11)
* add multiple file support ([ca7c164](https://github.com/devexperts/swagger-codegen-ts/commit/ca7c164)), closes [#2](https://github.com/devexperts/swagger-codegen-ts/issues/2)
* add multiple file support ([#6](https://github.com/devexperts/swagger-codegen-ts/issues/6)) ([acd1c2a](https://github.com/devexperts/swagger-codegen-ts/commit/acd1c2a)), closes [#2](https://github.com/devexperts/swagger-codegen-ts/issues/2)
* add parameters in path support ([89e79dd](https://github.com/devexperts/swagger-codegen-ts/commit/89e79dd)), closes [#9](https://github.com/devexperts/swagger-codegen-ts/issues/9)


### BREAKING CHANGES

* `pathToSpec` renamed to `pathsToSpec` and it is `string[]` now instead of `string`



## [0.3.7](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.6...v0.3.7) (2018-11-21)


### Bug Fixes

* fix recursion by adding explicit output type argument ([8f41fa9](https://github.com/devexperts/swagger-codegen-ts/commit/8f41fa9))



## [0.3.6](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.5...v0.3.6) (2018-11-21)



## [0.3.5](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.4...v0.3.5) (2018-11-07)


### Bug Fixes

* fix extra partial dependency ([eeef598](https://github.com/devexperts/swagger-codegen-ts/commit/eeef598))



## [0.3.4](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.3...v0.3.4) (2018-11-07)


### Bug Fixes

* fix missing path parameter dependencies ([3a5604f](https://github.com/devexperts/swagger-codegen-ts/commit/3a5604f))



## [0.3.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.2...v0.3.3) (2018-11-07)


### Bug Fixes

* fix unused imports ([df13a12](https://github.com/devexperts/swagger-codegen-ts/commit/df13a12))



## [0.3.2](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.1...v0.3.2) (2018-11-07)


### Bug Fixes

* fix unknown body parameter ([998debb](https://github.com/devexperts/swagger-codegen-ts/commit/998debb))



## [0.3.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.4...v0.3.1) (2018-11-07)


### Bug Fixes

* fix broken body parameters encoding ([c8a4214](https://github.com/devexperts/swagger-codegen-ts/commit/c8a4214))
* treat empty object as unknown type ([#5](https://github.com/devexperts/swagger-codegen-ts/issues/5)) ([3db0d90](https://github.com/devexperts/swagger-codegen-ts/commit/3db0d90))


### BREAKING CHANGES

* empty objects like '{}' are now serialized as unknown instead of object



## [0.2.4](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.3...v0.2.4) (2018-11-02)


### Bug Fixes

* add missing errors field ([ab8109a](https://github.com/devexperts/swagger-codegen-ts/commit/ab8109a))



## [0.2.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.2...v0.2.3) (2018-11-02)


### Bug Fixes

* remove extra body nesting, fix query/body requirements ([1490946](https://github.com/devexperts/swagger-codegen-ts/commit/1490946))



## [0.2.2](https://github.com/devexperts/swagger-codegen-ts/compare/0.2.1...v0.2.2) (2018-11-01)


### Features

* support recursive types ([1c4c211](https://github.com/devexperts/swagger-codegen-ts/commit/1c4c211))



## [0.2.1](https://github.com/devexperts/swagger-codegen-ts/compare/0.2.0...0.2.1) (2018-10-31)


### Bug Fixes

* bubble option dependencies instead of hardcoding ([ef48a40](https://github.com/devexperts/swagger-codegen-ts/commit/ef48a40))



# [0.2.0](https://github.com/devexperts/swagger-codegen-ts/compare/9d6e079...0.2.0) (2018-10-31)


### Bug Fixes

* controller groupping ([532877b](https://github.com/devexperts/swagger-codegen-ts/commit/532877b))


### Features

* add index.ts, generate function and update main section ([9d6e079](https://github.com/devexperts/swagger-codegen-ts/commit/9d6e079))


### BREAKING CHANGES

* move serializer to languages/typescript, rename default serializer



