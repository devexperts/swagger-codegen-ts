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



