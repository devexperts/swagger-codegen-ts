<a name="0.3.2"></a>
## [0.3.2](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/v0.3.1...v0.3.2) (2018-11-07)


### Bug Fixes

* fix unknown body parameter ([998debb](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/998debb))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/v0.3.0...v0.3.1) (2018-11-07)


### Bug Fixes

* fix broken body parameters encoding ([c8a4214](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/c8a4214))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/v0.2.4...v0.3.0) (2018-11-07)


### Bug Fixes

* treat empty object as unknown type ([#5](https://github.com/devex-web-frontend/swagger-codegen-ts/issues/5)) ([3db0d90](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/3db0d90))


### BREAKING CHANGES

* empty objects like '{}' are now serialized as unknown instead of object



<a name="0.2.4"></a>
## [0.2.4](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/v0.2.3...v0.2.4) (2018-11-02)


### Bug Fixes

* add missing errors field ([ab8109a](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/ab8109a))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/v0.2.2...v0.2.3) (2018-11-02)


### Bug Fixes

* remove extra body nesting, fix query/body requirements ([1490946](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/1490946))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/0.2.1...v0.2.2) (2018-11-01)


### Features

* support recursive types ([1c4c211](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/1c4c211))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/0.2.0...0.2.1) (2018-10-31)


### Bug Fixes

* bubble option dependencies instead of hardcoding ([ef48a40](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/ef48a40))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/devex-web-frontend/swagger-codegen-ts/compare/9d6e079...0.2.0) (2018-10-31)


### Bug Fixes

* controller groupping ([532877b](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/532877b))


### Features

* add index.ts, generate function and update main section ([9d6e079](https://github.com/devex-web-frontend/swagger-codegen-ts/commit/9d6e079))


### BREAKING CHANGES

* move serializer to languages/typescript, rename default serializer



