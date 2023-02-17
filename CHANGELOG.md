# [2.0.0-alpha.29](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.28...v2.0.0-alpha.29) (2023-02-17)


### Bug Fixes

* header parameters name generation ([aa4e788](https://github.com/devexperts/swagger-codegen-ts/commit/aa4e7888f50a875c326ce8b4e3fd59b31e9ab956))
* upgrading vulnerable dependencies ([a7ece38](https://github.com/devexperts/swagger-codegen-ts/commit/a7ece3804a21e278d44ce293ad52e5e3f8d50331))



# [2.0.0-alpha.28](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.27...v2.0.0-alpha.28) (2022-02-04)


### Bug Fixes

* AsyncAPI: update the `examples` codec according to the spec ([47a1ad3](https://github.com/devexperts/swagger-codegen-ts/commit/47a1ad37b713d2a33a96dd78eb3be83840cc2826))
* fixing the CI ([ab776f3](https://github.com/devexperts/swagger-codegen-ts/commit/ab776f3ed5adae11fa7dd5a9d1c66b7eb7acb4b8))
* upgrade to non-vulnerable dot-prop and trim-newlines ([9c966d2](https://github.com/devexperts/swagger-codegen-ts/commit/9c966d28b9f2d7eaaa6f97e4ebc0278dc87a68c4))
* upgrade vulnerable ansi-regex ([5150fb8](https://github.com/devexperts/swagger-codegen-ts/commit/5150fb8eaf7944907a4d13522af0151d57e5efe4))
* upgrading vulnerable glob-parent ([dadde68](https://github.com/devexperts/swagger-codegen-ts/commit/dadde68c890cf879e16ec89a97e7ea2529fcf907))

### Features

* AsyncAPI: add non empty array support ([ac33682](https://github.com/devexperts/swagger-codegen-ts/pull/162/commits/ac33682bf9c41d1e0853cf5cdac74f4779ce8376))

### BREAKING CHANGES

* upgrading to node 10



# [2.0.0-alpha.27](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.26...v2.0.0-alpha.27) (2021-09-14)

### Bug Fixes

* **deps:** fixing some dependabot alerts

### Features

* **oas3:** [IO-363] Arbitrary file downloads for OpenAPI 3.0 ([#144](https://github.com/devexperts/swagger-codegen-ts/pull/144))



# [2.0.0-alpha.26](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.25...v2.0.0-alpha.26) (2021-07-14)


### Bug Fixes

* **deps:** fixing some dependabot alerts ([790d5ff](https://github.com/devexperts/swagger-codegen-ts/commit/790d5ff7c5f6abd005b574fc759a9c167eba4fcd))
* **deps:** fixing vulnerable minimist version ([9d27320](https://github.com/devexperts/swagger-codegen-ts/commit/9d27320a8f500ecc53afce3f482c52dba55c58dc))


### Features

* **oas3:** Support nonEmptyArray for arrays with minItems > 0 ([5038b65](https://github.com/devexperts/swagger-codegen-ts/commit/5038b65563e9c113a335d811edb3fd5e4fe0791c))


### BREAKING CHANGES

* **oas3:** getSerializedArrayType now takes minItems as first argument



# [2.0.0-alpha.25](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.24...v2.0.0-alpha.25) (2021-05-27)


### Bug Fixes

* fix path to utils file when using date types ([#131](https://github.com/devexperts/swagger-codegen-ts/issues/131)) ([7448720](https://github.com/devexperts/swagger-codegen-ts/commit/7448720d5c23fd6f0d802a276cc5e2490687ff93)), closes [#117](https://github.com/devexperts/swagger-codegen-ts/issues/117)


### Features

* **asyncapi:** channel parameters ([33ea85d](https://github.com/devexperts/swagger-codegen-ts/commit/33ea85dcb1c22c495fb68bd243d15a1cfac95f02))
* support binary and text responses for 2.0 spec ([da355db](https://github.com/devexperts/swagger-codegen-ts/commit/da355dbd983fd3ae99453b3d1a569a9e5a8cb774))
* Support headers ([#133](https://github.com/devexperts/swagger-codegen-ts/issues/133)) ([24b70fa](https://github.com/devexperts/swagger-codegen-ts/commit/24b70fac3d645e868190761b43246d7c5eb07394)), closes [#57](https://github.com/devexperts/swagger-codegen-ts/issues/57)



# [2.0.0-alpha.23](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.22...v2.0.0-alpha.23) (2020-11-02)


### Bug Fixes

* incorrect serialization of array query parameters ([#127](https://github.com/devexperts/swagger-codegen-ts/issues/127)) ([b2e4ed6](https://github.com/devexperts/swagger-codegen-ts/commit/b2e4ed69eb5e1f98ff365cf7d055716083b97633))



# [2.0.0-alpha.22](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.21...v2.0.0-alpha.22) (2020-07-29)


### Bug Fixes

* **ts-utils:** remove timezone detection from DateFromISODateStringIO ([7e238dc](https://github.com/devexperts/swagger-codegen-ts/commit/7e238dc1aadf9314796254876bfa6ac97915f24c))



# [2.0.0-alpha.21](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.20...v2.0.0-alpha.21) (2020-07-08)


### Bug Fixes

* change function name in utils file ([1ba6017](https://github.com/devexperts/swagger-codegen-ts/commit/1ba601763a784ced67dcc70e1f5a740424bc01db))



# [2.0.0-alpha.20](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.19...v2.0.0-alpha.20) (2020-05-20)


### Features

* support arbitrary names in path/query params ([91a2e66](https://github.com/devexperts/swagger-codegen-ts/commit/91a2e664e4ec8a0dea6361af69ee8087721ce16d))


### BREAKING CHANGES

* query/path param names are now escaped



# [2.0.0-alpha.19](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.17...v2.0.0-alpha.19) (2020-05-20)


### Bug Fixes

* incorrect generation "deprecated" jsdoc for method ([#111](https://github.com/devexperts/swagger-codegen-ts/issues/111)) ([51c0029](https://github.com/devexperts/swagger-codegen-ts/commit/51c0029dd14e11701dd7777947828852ee9a58fa))
* query string is incorrectly serialized for primitive parameters ([#103](https://github.com/devexperts/swagger-codegen-ts/issues/103)) ([#109](https://github.com/devexperts/swagger-codegen-ts/issues/109)) ([be39d47](https://github.com/devexperts/swagger-codegen-ts/commit/be39d478ae7840372f25b6235fdefc3c7d6369a3))
* void response missing from union ([#104](https://github.com/devexperts/swagger-codegen-ts/issues/104)) ([#110](https://github.com/devexperts/swagger-codegen-ts/issues/110)) ([dfb2b36](https://github.com/devexperts/swagger-codegen-ts/commit/dfb2b36c987b74f07064ca44728d38554c2f43ee))


### Features

* filter operations response ([6164744](https://github.com/devexperts/swagger-codegen-ts/commit/6164744dadba2e5c7c74a886e18ed6469ab90f53))
* support arbitrary strings as type names in TS for OA3 ([79cd66e](https://github.com/devexperts/swagger-codegen-ts/commit/79cd66e7e05c8ad6339b70fd42f2d89842719789)), closes [#114](https://github.com/devexperts/swagger-codegen-ts/issues/114)


### BREAKING CHANGES

* type names and IO constant names now replace all non-alphanumeric characters with '_'
* void response is added to resulting response type
* non-successful response types are filtered out of resulting response type



# [2.0.0-alpha.17](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2020-01-31)


### Bug Fixes

* add year padding to the codec ([#101](https://github.com/devexperts/swagger-codegen-ts/issues/101)) ([fabe1c8](https://github.com/devexperts/swagger-codegen-ts/commit/fabe1c83e9d8336ece908b9fd3bcfe431eb1f495))



# [2.0.0-alpha.16](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.15...v2.0.0-alpha.16) (2020-01-31)


### Features

* expand sketch schema for support foreign symbols ([ca9d832](https://github.com/devexperts/swagger-codegen-ts/commit/ca9d83277536e1da75e99639e036817e2c578399))
* support date-time format ([#100](https://github.com/devexperts/swagger-codegen-ts/issues/100)) ([f48451d](https://github.com/devexperts/swagger-codegen-ts/commit/f48451d7bae7d3df4083be1fa9d41e9ceb6aa435))



# [2.0.0-alpha.15](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2020-01-23)


### Bug Fixes

* fix OperationObject name generation without operationId ([2da2822](https://github.com/devexperts/swagger-codegen-ts/commit/2da28222b1abb67046f004ff04aaf361a207ee30))


### Features

* add `nullable` support for OpenAPI3 ([937c21f](https://github.com/devexperts/swagger-codegen-ts/commit/937c21fe555d323ceeab6f77db72c82c192d36cf))


### BREAKING CHANGES

* if operation id is missing then url/pattern is included in the name



# [2.0.0-alpha.14](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2020-01-17)



# [2.0.0-alpha.13](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2020-01-16)


### Bug Fixes

* fix ResponseValidationError class to properly extend Error ([#94](https://github.com/devexperts/swagger-codegen-ts/issues/94)) ([e874154](https://github.com/devexperts/swagger-codegen-ts/commit/e874154bfe74a442611d7056c44cb0010df7d772)), closes [#93](https://github.com/devexperts/swagger-codegen-ts/issues/93)



# [2.0.0-alpha.12](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2019-12-18)


### Bug Fixes

* **sketch:** add prefix to original layer name ([fb00606](https://github.com/devexperts/swagger-codegen-ts/commit/fb006066f4f5ea8269fcefe559aea5cae26038b5))
* **sketch:** avoid collision for names with counter ([2b3d610](https://github.com/devexperts/swagger-codegen-ts/commit/2b3d61018517936506e26342b9ec78695210027f))


### Features

* support extract layers from sketch file ([4901aa1](https://github.com/devexperts/swagger-codegen-ts/commit/4901aa12a0ad7a7e99e1f7fc3ba5a4f8db6c6ff3))



# [2.0.0-alpha.11](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2019-12-09)


### Bug Fixes

* revert join to resolve ([c30661a](https://github.com/devexperts/swagger-codegen-ts/commit/c30661ad4a016403478c8a25b7d80e4ef5390277))


### Features

* support cwd as `generate` argument ([3d46f56](https://github.com/devexperts/swagger-codegen-ts/commit/3d46f56b022fc380657314cf5c0255d68b7c06f4))



# [2.0.0-alpha.10](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2019-12-09)


### Bug Fixes

* fix '..' and '.' in spec names ([3cec483](https://github.com/devexperts/swagger-codegen-ts/commit/3cec483096125f66e31ccbbd0e27dc62f33aef40))


### Code Refactoring

* simplify resolveRef ([763cc68](https://github.com/devexperts/swagger-codegen-ts/commit/763cc68275c28935ecdeb5375bc8f1ed7725af62))


### BREAKING CHANGES

* language is now a Reader of ResolveRefContext
* resolveRef now requires decoder as a second argument
* generate doesn't include `out` path in spec output
* language doesn't accept `out` path and can return `Fragment` to write to `out` directly



# [2.0.0-alpha.9](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2019-12-06)


### Bug Fixes

* fix encodeURIComponent in query serialization ([d7229d3](https://github.com/devexperts/swagger-codegen-ts/commit/d7229d36952d556f4cbab97984a8ba6317408163))



# [2.0.0-alpha.8](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2019-12-05)


### Bug Fixes

* fix encodeURIComponent in query serialization ([08a6ed0](https://github.com/devexperts/swagger-codegen-ts/commit/08a6ed098014745760b3e98685cc4a2bd51e967c))



# [2.0.0-alpha.7](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2019-12-04)


### Code Refactoring

* use Integer type from io-ts ([#84](https://github.com/devexperts/swagger-codegen-ts/issues/84)) ([d63fd60](https://github.com/devexperts/swagger-codegen-ts/commit/d63fd606c7dad1aa46a84e8eecfe9d24a6325861))


### Features

* implement support of kebab case in property names ([#83](https://github.com/devexperts/swagger-codegen-ts/issues/83)) ([ff937aa](https://github.com/devexperts/swagger-codegen-ts/commit/ff937aaf5ab7022b3e13a955a5f85fea1ff865e2)), closes [#82](https://github.com/devexperts/swagger-codegen-ts/issues/82)


### BREAKING CHANGES

* removed empty utils file



# [2.0.0-alpha.6](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2019-11-26)


### Bug Fixes

* support windows os environment ([3ef7cb0](https://github.com/devexperts/swagger-codegen-ts/commit/3ef7cb0124064cbd1e6dab6c7be1251fa961406b))


### Features

* sketch file format ([51fa6c6](https://github.com/devexperts/swagger-codegen-ts/commit/51fa6c682c6fbb569d0d3e0d1ed0ce21048ccaa7)), closes [#76](https://github.com/devexperts/swagger-codegen-ts/issues/76)
* type codec names for swagger 2.0 ([652f864](https://github.com/devexperts/swagger-codegen-ts/commit/652f8648af83acdce9ee84ed6a60da827bf3f1b0))



# [2.0.0-alpha.5](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2019-11-15)


### Features

* query serialization support in swagger-2 and openapi-3 ([3203a63](https://github.com/devexperts/swagger-codegen-ts/commit/3203a6381174b76296e72fe8676e37e1c7525b53)), closes [#74](https://github.com/devexperts/swagger-codegen-ts/issues/74)
* support format in primitive parameters in typescript-swagger-2 ([cf5cb6a](https://github.com/devexperts/swagger-codegen-ts/commit/cf5cb6aa510a354f3fb0dce87f214db3d8f25d76))


### BREAKING CHANGES

* operations now always treat query/body parameters as Option (no ?:)
* HTTPClient.request now receives query already serialized to string according to spec
* ArrayQueryParameterObject.items.type should be a primitive
* SerializedType/SerialiedFragment/SerializedParameter now filter out repeating dependencies and refs on construction
* operations now require format types (Integer, Date etc.)



# [2.0.0-alpha.4](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2019-11-11)


### Code Refactoring

* rename ReferenceObject codec to ReferenceObjectCodec ([bdda8e2](https://github.com/devexperts/swagger-codegen-ts/commit/bdda8e20a8b1cf1e8ebfb7a52692993c78c956e6))
* update SchemaObject ([0b4cf16](https://github.com/devexperts/swagger-codegen-ts/commit/0b4cf16cc814e6413e4d30be7266cbab397b27cf))
* update SchemaObject ([58ea69d](https://github.com/devexperts/swagger-codegen-ts/commit/58ea69dd96c2bc8c4df063eaa2ac7e68d0798eea))


### Features

* add branded numeric types and codecs ([7739952](https://github.com/devexperts/swagger-codegen-ts/commit/7739952aba1ae2b46c183b3ac5d364db04a66c95))
* asyncapi shema ([5fc7b84](https://github.com/devexperts/swagger-codegen-ts/commit/5fc7b84046f336ef7f95a3a3f7a36f29ff6d5949))
* full enum support ([21a6b8c](https://github.com/devexperts/swagger-codegen-ts/commit/21a6b8c2a049559fb63419019c90ba86e4afafa4))
* oneOf support for typescript openapi 3 ([f9e2ab5](https://github.com/devexperts/swagger-codegen-ts/commit/f9e2ab5e1d58b681b05dd8bb86c86d910c88f604))
* support Data Type Format in SchemaObject ([d8bc635](https://github.com/devexperts/swagger-codegen-ts/commit/d8bc6351e7c3137b79f031354ed6ed819c59466d))
* support ws channel bindings ([dab6d10](https://github.com/devexperts/swagger-codegen-ts/commit/dab6d107973a911a0d9baaea056f8359626d3c33)), closes [#68](https://github.com/devexperts/swagger-codegen-ts/issues/68)


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

* fix recursive allOf ([ff6a181](https://github.com/devexperts/swagger-codegen-ts/commit/ff6a181901849d1612f135083449b0975d72d2c7))
* fix recursive SchemaObject in typescript 2 ([8ab9fc0](https://github.com/devexperts/swagger-codegen-ts/commit/8ab9fc062d359f622da2f267d0d3ccab07204a08))


### Features

* full $ref support for typescript-3 ([e95c7fd](https://github.com/devexperts/swagger-codegen-ts/commit/e95c7fdde94f5d648428f966056cdcaee981ea86))


### BREAKING CHANGES

* SchemaObject codec was renamed to SchemaObjectCodec



# [2.0.0-alpha.2](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2019-10-31)


### Code Refactoring

* rename languages ([bb53cc7](https://github.com/devexperts/swagger-codegen-ts/commit/bb53cc74db0ae0b21048c5fcceab79cf5c5093fc))


### Features

* abstract from data structure in client ([f33b5f5](https://github.com/devexperts/swagger-codegen-ts/commit/f33b5f57f1e96ed9e95ef3956eb83cba04a68604)), closes [#48](https://github.com/devexperts/swagger-codegen-ts/issues/48)


### BREAKING CHANGES

* 2.0-rx was renamed to 2.0, 3.0-rx was renamed to 3.0
* apiClient dependency was renamed to httpClient
* APIClient was renamed to HTTPClient<F> and now extends MonadThrow<F>
* FullAPIRequest/APIRequest were joined and renamed to Request



# [2.0.0-alpha.1](https://github.com/devexperts/swagger-codegen-ts/compare/v2.0.0-alpha.0...v2.0.0-alpha.1) (2019-10-29)


### Features

* full $ref support for typescript 2 ([#58](https://github.com/devexperts/swagger-codegen-ts/issues/58)) ([9aa17b5](https://github.com/devexperts/swagger-codegen-ts/commit/9aa17b5daf4eff3e22c3fa34e7bb91a0da798447)), closes [#46](https://github.com/devexperts/swagger-codegen-ts/issues/46)
* Openapi 3.0 ([#51](https://github.com/devexperts/swagger-codegen-ts/issues/51)) ([fe3face](https://github.com/devexperts/swagger-codegen-ts/commit/fe3facead1a8c1bf641627f5d7ad2e89a530dcb9)), closes [#3](https://github.com/devexperts/swagger-codegen-ts/issues/3)


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

* make interface fields readonly ([4aec16b](https://github.com/devexperts/swagger-codegen-ts/commit/4aec16bcddca1773764e8944d1ed2fc759eb347a))
* move schema ([78d6513](https://github.com/devexperts/swagger-codegen-ts/commit/78d6513cb7a9516d1486e815658641d3dd0b1cc2))
* remove `T` symbol from types ([b4ef46c](https://github.com/devexperts/swagger-codegen-ts/commit/b4ef46c22fb0051633f33f068ea7446b6fb21aa1))
* split typescript language ([2a82892](https://github.com/devexperts/swagger-codegen-ts/commit/2a828928b76837779130ec6039616bcf673b27cd))


### Features

* fp-ts@2 ([fb0a3a2](https://github.com/devexperts/swagger-codegen-ts/commit/fb0a3a23fc0577da7e34db4dcb04a5096a5a967b))


### BREAKING CHANGES

* typescript template was moved to `typescript/2.0-rx/index.ts`
* interface fields were made readonly
* `T` symbol was removed from types
* schema was moved to separate directory



# [0.7.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.6.1...v0.7.0) (2019-09-02)


### Features

* error reporting improvement ([#35](https://github.com/devexperts/swagger-codegen-ts/issues/35)) ([4992d39](https://github.com/devexperts/swagger-codegen-ts/commit/4992d398b32fcaae44a03ca6d916d11880dce347))


### BREAKING CHANGES

* ReportValidationError message format has been changed



## [0.6.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.6.0...v0.6.1) (2019-07-27)


### Bug Fixes

* support enums with single value ([#33](https://github.com/devexperts/swagger-codegen-ts/issues/33)) ([#34](https://github.com/devexperts/swagger-codegen-ts/issues/34)) ([98000b4](https://github.com/devexperts/swagger-codegen-ts/commit/98000b4f98cadd58fd5a8b2fbc1649c6558558ae))



# [0.6.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.5.0...v0.6.0) (2019-05-14)


### Bug Fixes

* misspelled for class name ResponseValidationError ([9f5e99e](https://github.com/devexperts/swagger-codegen-ts/commit/9f5e99e5c6fcdc20d9f8dd3f479546e64ef144d4))


### BREAKING CHANGES

* generated class name changed to ResponseValidationError



# [0.5.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.3...v0.5.0) (2019-02-19)


### Bug Fixes

* make fp-ts, io-ts and remote-data to be peer dependencies ([#29](https://github.com/devexperts/swagger-codegen-ts/issues/29)) ([988212b](https://github.com/devexperts/swagger-codegen-ts/commit/988212bb9894218bc2bd7192921b4c9b307b481a))


### BREAKING CHANGES

* listed dependencies were moved to peerDependencies



## [0.4.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.2...v0.4.3) (2019-02-15)


### Bug Fixes

* Ability to use cusom serializer. Solves [#26](https://github.com/devexperts/swagger-codegen-ts/issues/26) ([#27](https://github.com/devexperts/swagger-codegen-ts/issues/27)) ([a76be11](https://github.com/devexperts/swagger-codegen-ts/commit/a76be11ec8948328e83b90041961c3e32984e46b))
* Consider HTTP201 to be successful code ([#28](https://github.com/devexperts/swagger-codegen-ts/issues/28)) ([b19b33d](https://github.com/devexperts/swagger-codegen-ts/commit/b19b33d89964517c716a780fd8272b6d4376a98f))



## [0.4.2](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.1...v0.4.2) (2019-02-14)


### Bug Fixes

* lock fp-ts and io-ts minor versions ([#25](https://github.com/devexperts/swagger-codegen-ts/issues/25)) ([438067a](https://github.com/devexperts/swagger-codegen-ts/commit/438067ac505c6fe069169f6e7258aa81465841d1))
* tag parameters fix ([#23](https://github.com/devexperts/swagger-codegen-ts/issues/23)) ([348058e](https://github.com/devexperts/swagger-codegen-ts/commit/348058eff1bfea52d1905ca074187c953855edc9)), closes [#17](https://github.com/devexperts/swagger-codegen-ts/issues/17)



## [0.4.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.4.0...v0.4.1) (2018-12-14)


### Bug Fixes

* fix non-recursive with $ref to the same file and same name ([#13](https://github.com/devexperts/swagger-codegen-ts/issues/13)) ([eaa7a4b](https://github.com/devexperts/swagger-codegen-ts/commit/eaa7a4b459423921aa1ea0f78b20e925282af1eb))



# [0.4.0](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.7...v0.4.0) (2018-12-14)


### Features

* add alOff support ([6f1989b](https://github.com/devexperts/swagger-codegen-ts/commit/6f1989bca68ffe02313a3b97edea41b087c29b93)), closes [#11](https://github.com/devexperts/swagger-codegen-ts/issues/11)
* add multiple file support ([ca7c164](https://github.com/devexperts/swagger-codegen-ts/commit/ca7c1649712ca521c23c9483fa8820c70269e928)), closes [#2](https://github.com/devexperts/swagger-codegen-ts/issues/2)
* add multiple file support ([#6](https://github.com/devexperts/swagger-codegen-ts/issues/6)) ([acd1c2a](https://github.com/devexperts/swagger-codegen-ts/commit/acd1c2a355419f3848b58be7d10d89d9c234fdb7)), closes [#2](https://github.com/devexperts/swagger-codegen-ts/issues/2)
* add parameters in path support ([89e79dd](https://github.com/devexperts/swagger-codegen-ts/commit/89e79dd5ee63eaf8edc3c21b4ff9a542b778df4d)), closes [#9](https://github.com/devexperts/swagger-codegen-ts/issues/9)


### BREAKING CHANGES

* `pathToSpec` renamed to `pathsToSpec` and it is `string[]` now instead of `string`



## [0.3.7](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.6...v0.3.7) (2018-11-21)


### Bug Fixes

* fix recursion by adding explicit output type argument ([8f41fa9](https://github.com/devexperts/swagger-codegen-ts/commit/8f41fa9b81327f3f6f8529d66c44c19a4a5428fc))



## [0.3.6](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.5...v0.3.6) (2018-11-21)



## [0.3.5](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.4...v0.3.5) (2018-11-07)


### Bug Fixes

* fix extra partial dependency ([eeef598](https://github.com/devexperts/swagger-codegen-ts/commit/eeef598fbc4a7f8fbc2ff1cdd8c40199e8faf02c))



## [0.3.4](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.3...v0.3.4) (2018-11-07)


### Bug Fixes

* fix missing path parameter dependencies ([3a5604f](https://github.com/devexperts/swagger-codegen-ts/commit/3a5604f0c93c502bff08acaf0ff6a29013a51301))



## [0.3.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.2...v0.3.3) (2018-11-07)


### Bug Fixes

* fix unused imports ([df13a12](https://github.com/devexperts/swagger-codegen-ts/commit/df13a12388defe1c5064a8811ce9722808b28bc6))



## [0.3.2](https://github.com/devexperts/swagger-codegen-ts/compare/v0.3.1...v0.3.2) (2018-11-07)


### Bug Fixes

* fix unknown body parameter ([998debb](https://github.com/devexperts/swagger-codegen-ts/commit/998debb2388f7bf6557490f3b041cb24dc018e42))



## [0.3.1](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.4...v0.3.1) (2018-11-07)


### Bug Fixes

* fix broken body parameters encoding ([c8a4214](https://github.com/devexperts/swagger-codegen-ts/commit/c8a4214ae9e0dc38e8e832eaa328b99890aee897))
* treat empty object as unknown type ([#5](https://github.com/devexperts/swagger-codegen-ts/issues/5)) ([3db0d90](https://github.com/devexperts/swagger-codegen-ts/commit/3db0d905258eb4ef609c1b833b5188ffd545c91a))


### BREAKING CHANGES

* empty objects like '{}' are now serialized as unknown instead of object



## [0.2.4](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.3...v0.2.4) (2018-11-02)


### Bug Fixes

* add missing errors field ([ab8109a](https://github.com/devexperts/swagger-codegen-ts/commit/ab8109a7b14fdf3be60585c2aaed88931a957617))



## [0.2.3](https://github.com/devexperts/swagger-codegen-ts/compare/v0.2.2...v0.2.3) (2018-11-02)


### Bug Fixes

* remove extra body nesting, fix query/body requirements ([1490946](https://github.com/devexperts/swagger-codegen-ts/commit/14909462c61759520b35299793d94f1e03506af7))



## [0.2.2](https://github.com/devexperts/swagger-codegen-ts/compare/0.2.1...v0.2.2) (2018-11-01)


### Features

* support recursive types ([1c4c211](https://github.com/devexperts/swagger-codegen-ts/commit/1c4c21199d7bc37a217de14f3fdb5aaae86c4ec1))



## [0.2.1](https://github.com/devexperts/swagger-codegen-ts/compare/0.2.0...0.2.1) (2018-10-31)


### Bug Fixes

* bubble option dependencies instead of hardcoding ([ef48a40](https://github.com/devexperts/swagger-codegen-ts/commit/ef48a40d989a4de156fb292b07101026bc8f92b9))



# [0.2.0](https://github.com/devexperts/swagger-codegen-ts/compare/9d6e079f4bb3146706ecd131edd0af099b1a3ec3...0.2.0) (2018-10-31)


### Bug Fixes

* controller groupping ([532877b](https://github.com/devexperts/swagger-codegen-ts/commit/532877b31dcdefc8316977315860624adae3c066))


### Features

* add index.ts, generate function and update main section ([9d6e079](https://github.com/devexperts/swagger-codegen-ts/commit/9d6e079f4bb3146706ecd131edd0af099b1a3ec3))


### BREAKING CHANGES

* move serializer to languages/typescript, rename default serializer



