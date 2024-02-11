# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [5.2.2](https://github.com/panva/jose/compare/v5.2.1...v5.2.2) (2024-02-11)


### Fixes

* **types:** iv and tag is optional in JSON serializations ([53019cd](https://github.com/panva/jose/commit/53019cd1fa3a4dc265d4868b9c626d4d6c832e86))

## [5.2.1](https://github.com/panva/jose/compare/v5.2.0...v5.2.1) (2024-02-03)


### Fixes

* **build:** refactor export targets for browser, node cjs, and node esm builds ([50cbc65](https://github.com/panva/jose/commit/50cbc65e165ea27b4ed08ee7fc5a747a17d235da))

## [5.2.0](https://github.com/panva/jose/compare/v5.1.3...v5.2.0) (2023-12-24)


### Features

* extend JWT NumericDate setter syntax ([ae363c3](https://github.com/panva/jose/commit/ae363c3c434fb040985f08da68ed02067d205cbe))

## [5.1.3](https://github.com/panva/jose/compare/v5.1.2...v5.1.3) (2023-11-30)

## [5.1.2](https://github.com/panva/jose/compare/v5.1.1...v5.1.2) (2023-11-27)


### Fixes

* do not mutate JWTVerifyOptions.requiredClaims ([1bf9cec](https://github.com/panva/jose/commit/1bf9cec024a4d01d989e15bb6e4b54e3940b4458)), closes [#610](https://github.com/panva/jose/issues/610)

## [5.1.1](https://github.com/panva/jose/compare/v5.1.0...v5.1.1) (2023-11-14)


### Refactor

* deprecate the RSA1_5 JWE Algorithm ([f746da1](https://github.com/panva/jose/commit/f746da172b693eb417c4f75c8db6230cf213cd76))

## [5.1.0](https://github.com/panva/jose/compare/v5.0.2...v5.1.0) (2023-11-03)


### Features

* add payload generics to jose.decodeJwt ([9de49e2](https://github.com/panva/jose/commit/9de49e26956a20cdb94472f10f83b20480613329)), closes [#604](https://github.com/panva/jose/issues/604)

## [5.0.2](https://github.com/panva/jose/compare/v5.0.1...v5.0.2) (2023-11-02)


### Fixes

* **createRemoteJWKSet:** ensure a default user-agent header is present ([887dd3c](https://github.com/panva/jose/commit/887dd3cd05f34e06ce20ad00201599a5a469fbac)), closes [#600](https://github.com/panva/jose/issues/600)

## [5.0.1](https://github.com/panva/jose/compare/v5.0.0...v5.0.1) (2023-10-25)


### Fixes

* also use ES2020 in the CDN bundles ([8c4d390](https://github.com/panva/jose/commit/8c4d3909db56f2d62cf2bf413e8343c0fdd2b92f))

## [5.0.0](https://github.com/panva/jose/compare/v4.15.4...v5.0.0) (2023-10-25)


### ⚠ BREAKING CHANGES

* **Node.js:** return Uint8Array (not a Buffer) from base64url.decode
* Browser distribution is now built using ES2020 as a target
* Node.js distribution is now built using ES2022 as a target
* **types:** jwtVerify and jwtDecrypt type argument for the resolved
KeyLike type is now a second optional type argument following a type
for the JWT Claims Set (aka payload)
* PBES2 Key Management Algorithms' use in decrypt
functions now requires the use of the keyManagementAlgorithms option
to explicitly opt-in for their use.
* importJWK "octAsKeyObject" option was removed.
importJWK will no longer return CryptoKey or KeyObject for "oct" (octet
sequence) JWK key types, it will instead always return a Uint8Array
formed from the "k" (Key Value) Parameter regardless of the other JWK
Parameters that may be present.
* End-Of-Life versions of Node.js as of October 2023 are
no longer supported. Node.js 18, 20, and 21 and future releases are
the ones that remain supported.
* The JWE "zip" (Compression Algorithm) Header Parameter
is no longer supported by this JOSE implementation.

### Features

* add Date as valid input to timestamp setting functions ([bd830a4](https://github.com/panva/jose/commit/bd830a47979912d4c0775d01a05584c2aa9f0dcd))
* default to an empty payload in JWT producing constructors ([98d6ca1](https://github.com/panva/jose/commit/98d6ca12c448697ed6342b1230b351eb5bfa0df8))
* **types:** add optional Generics for JWT verify and decrypt ([61bd2a0](https://github.com/panva/jose/commit/61bd2a0adb638c1c2469459d78556a99cec697c7)), closes [#568](https://github.com/panva/jose/issues/568)


### Reverts

* Revert "test: fix test under lts/erbium" ([b64b6c7](https://github.com/panva/jose/commit/b64b6c731c3e2d0e6751e0221804af08d7015bfa))


### Refactor

* Browser distribution is now built using ES2020 as a target ([1836684](https://github.com/panva/jose/commit/18366840e1ae557b951fe921c5004b17ad56e972))
* drop support for EOL Node.js versions ([b5aee54](https://github.com/panva/jose/commit/b5aee542fb5995dd29e012011f832ce8dfd24e29))
* importJWK always returns a Uint8Array for symmetric key inputs ([163e1b0](https://github.com/panva/jose/commit/163e1b02ed5b64368110d750c9f5f5c3d247042d))
* Node.js distribution is now built using ES2022 as a target ([239697a](https://github.com/panva/jose/commit/239697a17d048b8eb2120d29adff7f98edc0f26e))
* **Node.js:** return Uint8Array (not a Buffer) from base64url.decode ([02d5182](https://github.com/panva/jose/commit/02d51827e24195d650cf83de100ae16cd8b0599e))
* PBES2 Algorithms require explicit opt-in during verification ([e2da031](https://github.com/panva/jose/commit/e2da031381b7c5327ea9a0ccf58f059fa8af7e92))
* remove support for JWE "zip" (Compression Algorithm) Header Parameter ([16998b1](https://github.com/panva/jose/commit/16998b15c75d90b64eb5b0fa0713cfdfa7896757))
* **types:** rename type parameters for the KeyLike returns ([eddd400](https://github.com/panva/jose/commit/eddd400235e84e3d84c1a8471b01915a12d3d866))
* update allow list error messages ([fe8114c](https://github.com/panva/jose/commit/fe8114c82646f2468857effb934f39dd7bc75902))

## [4.15.4](https://github.com/panva/jose/compare/v4.15.3...v4.15.4) (2023-10-14)


### Fixes

* **types:** export GetKeyFunction ([#592](https://github.com/panva/jose/issues/592)) ([936c9df](https://github.com/panva/jose/commit/936c9dff2bc124dc5f64906a96f665a28e57392c)), closes [#591](https://github.com/panva/jose/issues/591)

## [4.15.3](https://github.com/panva/jose/compare/v4.15.2...v4.15.3) (2023-10-11)

## [4.15.2](https://github.com/panva/jose/compare/v4.15.1...v4.15.2) (2023-10-04)


### Fixes

* **build:** add a node target for jose-browser-runtime releases ([abb63d0](https://github.com/panva/jose/commit/abb63d0e8e7a55326dc343eec5f5eee9addc1dcf))

## [4.15.1](https://github.com/panva/jose/compare/v4.15.0...v4.15.1) (2023-10-02)


### Fixes

* resolve missing types for the cryptoRuntime const ([1627965](https://github.com/panva/jose/commit/16279652a67133fba0db7c9879767f000a8f1662))

## [4.15.0](https://github.com/panva/jose/compare/v4.14.6...v4.15.0) (2023-10-02)


### Features

* export the used crypto runtime as a constant ([0681dda](https://github.com/panva/jose/commit/0681dda1592a82c22a18981002b3763c502d0fc4))

## [4.14.6](https://github.com/panva/jose/compare/v4.14.5...v4.14.6) (2023-09-04)


### Fixes

* **build:** publish bundle and umd files with jose-browser-runtime module ([62fcbcc](https://github.com/panva/jose/commit/62fcbcc2170db00f5bbfc817839523dbf970239f)), closes [#571](https://github.com/panva/jose/issues/571)

## [4.14.5](https://github.com/panva/jose/compare/v4.14.4...v4.14.5) (2023-09-02)


### Refactor

* catch type error when decoding base64url signature ([#569](https://github.com/panva/jose/issues/569)) ([935e920](https://github.com/panva/jose/commit/935e920d29d242e0446d365b1e4f0449d144c23c))
* catch type errors when decoding various base64url strings ([9024e87](https://github.com/panva/jose/commit/9024e870ece4ef121205dadc733c36d7978b97ab))

## [4.14.4](https://github.com/panva/jose/compare/v4.14.3...v4.14.4) (2023-04-30)


### Refactor

* cleanup NODE-ED25519 workerd workarounds ([072e83d](https://github.com/panva/jose/commit/072e83de5bf3a15775b0bf25ef8afa8851b8862d))

## [4.14.3](https://github.com/panva/jose/compare/v4.14.2...v4.14.3) (2023-04-27)


### Reverts

* Revert "fix(types): headers and payloads may only be JSON values and primitives" ([06d8101](https://github.com/panva/jose/commit/06d8101a5827a69bb25c2847b1a10d03f015db03)), closes [#534](https://github.com/panva/jose/issues/534)

## [4.14.2](https://github.com/panva/jose/compare/v4.14.1...v4.14.2) (2023-04-26)


### Fixes

* **types:** headers and payloads may only be JSON values and primitives ([24f306e](https://github.com/panva/jose/commit/24f306e7f33485daaba1e250dfc97b5f621079ad))

## [4.14.1](https://github.com/panva/jose/compare/v4.14.0...v4.14.1) (2023-04-20)

## [4.14.0](https://github.com/panva/jose/compare/v4.13.2...v4.14.0) (2023-04-14)


### Features

* add requiredClaims JWT validation option ([eeea91d](https://github.com/panva/jose/commit/eeea91df48cadda84e4fdce6bbba7251ca7af83f))

## [4.13.2](https://github.com/panva/jose/compare/v4.13.1...v4.13.2) (2023-04-12)


### Refactor

* src/util/decode_protected_header.ts ([5716725](https://github.com/panva/jose/commit/5716725d7eb6fa8a416638db9d448840f839f620))

## [4.13.1](https://github.com/panva/jose/compare/v4.13.0...v4.13.1) (2023-03-02)


### Fixes

* **workerd:** avoid "The script will never generate a response" edge cases completely ([96a8c99](https://github.com/panva/jose/commit/96a8c99189f2399e9816ae1bca04b6d9cff93c26)), closes [#355](https://github.com/panva/jose/issues/355) [#509](https://github.com/panva/jose/issues/509)

## [4.13.0](https://github.com/panva/jose/compare/v4.12.2...v4.13.0) (2023-02-27)


### Features

* **types:** allow generics to aid in CryptoKey or KeyObject narrowing of KeyLike ([6effa4d](https://github.com/panva/jose/commit/6effa4d35cfa984a5859d228f750e96af0c0a5e5))


### Fixes

* make jose.EmbeddedJWK arguments optional ([20610a9](https://github.com/panva/jose/commit/20610a930d337c25756de107d93b84ccc52707a3))

## [4.12.2](https://github.com/panva/jose/compare/v4.12.1...v4.12.2) (2023-02-27)


### Fixes

* **types:** declare explicit return from EmbeddedJWK ([46934ac](https://github.com/panva/jose/commit/46934ac474ba0119976c5ac15cce4ea7bf50de8c))

## [4.12.1](https://github.com/panva/jose/compare/v4.12.0...v4.12.1) (2023-02-27)


### Refactor

* clarify when alg is used and required on key imports ([19e525f](https://github.com/panva/jose/commit/19e525fdee04ba6281f70bd20523b878408aa7ee))
* **node:** have node:crypto deal with x509 parsing ([45bb45d](https://github.com/panva/jose/commit/45bb45d42b6c96cbfcab7242d5cc366fb34481f1))

## [4.12.0](https://github.com/panva/jose/compare/v4.11.4...v4.12.0) (2023-02-15)


### Features

* enable key iteration over JWKSMultipleMatchingKeys ([a278acd](https://github.com/panva/jose/commit/a278acdb0f458e555abdc1d048920e7da4fb7981))

## [4.11.4](https://github.com/panva/jose/compare/v4.11.3...v4.11.4) (2023-02-07)


### Fixes

* **build:** ignore deno files in npm publishes ([b3d6a11](https://github.com/panva/jose/commit/b3d6a11bf0803c37e1e9d0368ccec1f1264eef74))

## [4.11.3](https://github.com/panva/jose/compare/v4.11.2...v4.11.3) (2023-02-07)


### Fixes

* **CF Workers:** improve miniflare compat with different Node.js versions, get ready for future non-proprietary support ([3406b9f](https://github.com/panva/jose/commit/3406b9f73b1884b5db9c60675a68fe85794d48e0)), closes [#446](https://github.com/panva/jose/issues/446) [#495](https://github.com/panva/jose/issues/495) [#497](https://github.com/panva/jose/issues/497)

## [4.11.2](https://github.com/panva/jose/compare/v4.11.1...v4.11.2) (2023-01-01)


### Refactor

* **node:** dry node version checks ([aff2f7c](https://github.com/panva/jose/commit/aff2f7c00f28b599ee72dd9f0a36c3783f1e195f))

## [4.11.1](https://github.com/panva/jose/compare/v4.11.0...v4.11.1) (2022-11-22)

## [4.11.0](https://github.com/panva/jose/compare/v4.10.4...v4.11.0) (2022-11-08)


### Features

* add bun as a supported runtime ([3a63631](https://github.com/panva/jose/commit/3a636318914866decd934d455d7c3789d304992c))


### Fixes

* respect JWK ext for symmetric keys ([20557fc](https://github.com/panva/jose/commit/20557fccf1ce0ebd7dd5d18cc33aa64d6f7b35ba))

## [4.10.4](https://github.com/panva/jose/compare/v4.10.3...v4.10.4) (2022-10-28)


### Fixes

* typo in importPKSC8 error message ([#468](https://github.com/panva/jose/issues/468)) ([746bc64](https://github.com/panva/jose/commit/746bc64675636f2a09a6745e71cba8a2bdf3718f))
* workaround for invalid use checks on CF Workers and Deno ([e4d04eb](https://github.com/panva/jose/commit/e4d04eb65f72041784d948eaa8432e4b64193729))

## [4.10.3](https://github.com/panva/jose/compare/v4.10.2...v4.10.3) (2022-10-20)

## [4.10.2](https://github.com/panva/jose/compare/v4.10.1...v4.10.2) (2022-10-20)

## [4.10.1](https://github.com/panva/jose/compare/v4.10.0...v4.10.1) (2022-10-20)

## [4.10.0](https://github.com/panva/jose/compare/v4.9.3...v4.10.0) (2022-09-27)


### Features

* Curve25519, and Curve448 support for WebCryptoAPI runtimes ([fea359a](https://github.com/panva/jose/commit/fea359a2055aa1b65170999a7f8e1bb23a3a1cb5))


### Fixes

* **importX509:** handle length encodings better ([47d0d77](https://github.com/panva/jose/commit/47d0d777a1ac90ff2ed0368fdab536db3d17aa8c)), closes [#459](https://github.com/panva/jose/issues/459)

## [4.9.3](https://github.com/panva/jose/compare/v4.9.2...v4.9.3) (2022-09-15)


### Refactor

* update CEK length validation error message ([81a92a9](https://github.com/panva/jose/commit/81a92a9a9803022b82ea67577bde3fc0da3ecc6f))
* update key input validation error messages ([2eac34a](https://github.com/panva/jose/commit/2eac34aa8f02c800a5f0b944e03fbe681c962b9c))
* update keylike description for WinterCG ([6741679](https://github.com/panva/jose/commit/6741679936acf78f00c6effd559b4698cc92f123))

## [4.9.2](https://github.com/panva/jose/compare/v4.9.1...v4.9.2) (2022-09-01)


### Fixes

* limit default PBES2 alg's computational expense ([03d6d01](https://github.com/panva/jose/commit/03d6d013bf6e070e85adfe5731f526978e3e8e4d))

## [4.9.1](https://github.com/panva/jose/compare/v4.9.0...v4.9.1) (2022-08-29)


### Fixes

* **deno:** add a Deno package entrypoint ([9f3c459](https://github.com/panva/jose/commit/9f3c459e30b71eec54163d500edb59f5c72bf7c9))

## [4.9.0](https://github.com/panva/jose/compare/v4.8.3...v4.9.0) (2022-08-17)


### Features

* add support for RFC 9278 - JWK Thumbprint URI ([d06ce65](https://github.com/panva/jose/commit/d06ce654666c5f584716f39843534118407c14e0))


### Refactor

* consume some base64url decode errors ([#436](https://github.com/panva/jose/issues/436)) ([caaf2c3](https://github.com/panva/jose/commit/caaf2c38dc51209d7adc493029f416c61759b1b1))
* unify JOSENotSupported throw on key export ([fe5d093](https://github.com/panva/jose/commit/fe5d093bf74b812ecd3ee92d40dd02619e88e06c))

## [4.8.3](https://github.com/panva/jose/compare/v4.8.1...v4.8.3) (2022-06-29)

## [4.8.1](https://github.com/panva/jose/compare/v4.8.0...v4.8.1) (2022-05-02)


### Fixes

* **typescript:** add types export for nodenext module resolution ([#406](https://github.com/panva/jose/issues/406)) ([5a6d8f0](https://github.com/panva/jose/commit/5a6d8f0a2a3283bd1e832f1e71906d70f74c1262))

## [4.8.0](https://github.com/panva/jose/compare/v4.7.0...v4.8.0) (2022-04-26)


### Features

* add "worker" export in package.json ([#400](https://github.com/panva/jose/issues/400)) ([c58c80a](https://github.com/panva/jose/commit/c58c80ae98b7a55b3b95e72438040983ae9a23de))
* optional headers options for createRemoteJWKSet ([#397](https://github.com/panva/jose/issues/397)) ([b4612f5](https://github.com/panva/jose/commit/b4612f5d256b773ab7a1144ac839bdf0f8ccff53))

## [4.7.0](https://github.com/panva/jose/compare/v4.6.2...v4.7.0) (2022-04-21)


### Features

* add createRemoteJWKSet cacheMaxAge option ([5017d95](https://github.com/panva/jose/commit/5017d95764b3aca551631c1a2fbe7cc40cbb6055)), closes [#394](https://github.com/panva/jose/issues/394)

## [4.6.2](https://github.com/panva/jose/compare/v4.6.1...v4.6.2) (2022-04-19)


### Fixes

* dont check JWT iat is in the past unless maxTokenAge is used ([96d85c7](https://github.com/panva/jose/commit/96d85c70033d2249de41ed07d97ed6843c15eb2a))

## [4.6.1](https://github.com/panva/jose/compare/v4.6.0...v4.6.1) (2022-04-11)

## [4.6.0](https://github.com/panva/jose/compare/v4.5.3...v4.6.0) (2022-03-06)


### Features

* mark APIs and parameters that can lead to footguns as deprecated ([0ddbcc6](https://github.com/panva/jose/commit/0ddbcc6725ecb2d68efdaf0951cec4db31cc9b16))
* **types:** include JSDoc in the types ([74187a9](https://github.com/panva/jose/commit/74187a9aa97cac70c42035949dd847177025af7c))

## [4.5.3](https://github.com/panva/jose/compare/v4.5.2...v4.5.3) (2022-03-05)


### Fixes

* **web api runtime:** rely on default fetch init values ([df6d966](https://github.com/panva/jose/commit/df6d96651d4ddeeb4a9b05bd2d778bd58528dad2))

## [4.5.2](https://github.com/panva/jose/compare/v4.5.1...v4.5.2) (2022-03-04)


### Fixes

* decrypting empty ciphertext compact JWEs ([#374](https://github.com/panva/jose/issues/374)) ([95fe597](https://github.com/panva/jose/commit/95fe59791dab9b31203f7a4ec5f4b44633d9b74f))

## [4.5.1](https://github.com/panva/jose/compare/v4.5.0...v4.5.1) (2022-02-22)


### Fixes

* **typescript:** allow synchronous get key functions ([7c99153](https://github.com/panva/jose/commit/7c99153a9e8ae45a35de7eff45fcf6e60e1b088b))

## [4.5.0](https://github.com/panva/jose/compare/v4.4.0...v4.5.0) (2022-02-07)


### Features

* add jose.decodeJwt utility ([3d2a2b8](https://github.com/panva/jose/commit/3d2a2b8eee18c9b60debbfae284b2bc3d2947dd2))


### Fixes

* concurrent fetch await in cloudflare ([e44cd18](https://github.com/panva/jose/commit/e44cd18ea4cf8af173f874ca3a847fc315eee592)), closes [#355](https://github.com/panva/jose/issues/355)

## [4.4.0](https://github.com/panva/jose/compare/v4.3.9...v4.4.0) (2022-01-24)


### Features

* add createLocalJWKSet, resolver to verify using a local JWKSet ([bd7bf37](https://github.com/panva/jose/commit/bd7bf3789c146d765bbee2db0c93ba035020b24c))

## [4.3.9](https://github.com/panva/jose/compare/v4.3.8...v4.3.9) (2022-01-22)


### Fixes

* only add y to the epk header parameter when EC keys are used ([dd6775e](https://github.com/panva/jose/commit/dd6775eed00b60c14b7038ddec85c8bb3cf05781)), closes [#348](https://github.com/panva/jose/issues/348)

## [4.3.8](https://github.com/panva/jose/compare/v4.3.7...v4.3.8) (2022-01-09)

## [4.3.7](https://github.com/panva/jose/compare/v4.3.6...v4.3.7) (2021-11-18)


### Fixes

* **typescript:** b64: true is fine to use in JWT, its useless, but allowed ([#324](https://github.com/panva/jose/issues/324)) ([ee401c9](https://github.com/panva/jose/commit/ee401c9e0f23f10ff5c0484798cb0cb3e9074b84))

## [4.3.6](https://github.com/panva/jose/compare/v4.3.5...v4.3.6) (2021-11-16)


### Fixes

* **electron:** rsa-pss keys are never supported ([188c1f7](https://github.com/panva/jose/commit/188c1f709002302da99105cfc8fc6863a95761d9))

## [4.3.5](https://github.com/panva/jose/compare/v4.3.4...v4.3.5) (2021-11-12)


### Fixes

* **typescript:** b64 header regression ([#324](https://github.com/panva/jose/issues/324)) ([9da0a7f](https://github.com/panva/jose/commit/9da0a7f49cf763314748eb01303320ce5af69762))

## [4.3.4](https://github.com/panva/jose/compare/v4.3.3...v4.3.4) (2021-11-12)


### Fixes

* Compact JWS verification handles a zero-length payload string ([7c70e7b](https://github.com/panva/jose/commit/7c70e7b9700886dfad8e7555b909da8e079c88da))

## [4.3.3](https://github.com/panva/jose/compare/v4.3.2...v4.3.3) (2021-11-11)


### Fixes

* **typescript:** apply updated compact and jwt headers to compact/jwt verify and decrypt results ([0c1946c](https://github.com/panva/jose/commit/0c1946c3e2a95e082b9a9095bf035756d8f17730))

## [4.3.2](https://github.com/panva/jose/compare/v4.3.0...v4.3.2) (2021-11-11)


### Fixes

* createRemoteJWKSet handles all JWS syntaxes ([aaba8f3](https://github.com/panva/jose/commit/aaba8f3000b76b41733567367b9000348a839c17))
* **typescript:** Compact JWS Header Parameters has alg and enc as required ([0fa87af](https://github.com/panva/jose/commit/0fa87af64b8e9f0f0cb68264f4dc22cc985acf91))
* **typescript:** Compact JWS Header Parameters has alg as required ([c7fabd0](https://github.com/panva/jose/commit/c7fabd0f012513f3c9161b0f59befae1d7430e16))
* **typescript:** Signed JWT Header Parameters has alg as required and b64 as never ([79cbd82](https://github.com/panva/jose/commit/79cbd82d3dd36f9ef87e4d306d77d9694a1c5836))

## [4.3.0](https://github.com/panva/jose/compare/v4.2.1...v4.3.0) (2021-11-11)


### Features

* add GeneralSign signature and GeneralEncrypt recipient builder chaining ([cfc93f5](https://github.com/panva/jose/commit/cfc93f5daf4729a189ef5caabae4a9ec9ad45378))

## [4.2.1](https://github.com/panva/jose/compare/v4.2.0...v4.2.1) (2021-11-09)


### Fixes

* **node:** dont mention CryptoKey in versions without webcrypto ([401cabf](https://github.com/panva/jose/commit/401cabf97419768cea1d685dc73d933fa38d6c26))

## [4.2.0](https://github.com/panva/jose/compare/v4.1.5...v4.2.0) (2021-11-08)


### Features

* General JWE Encryption ([94eca81](https://github.com/panva/jose/commit/94eca816872527074d2a591a983ee6c5d64da30c))

## [4.1.5](https://github.com/panva/jose/compare/v4.1.4...v4.1.5) (2021-11-05)


### Fixes

* importX509 certificate values that do not include a version number ([51a18b6](https://github.com/panva/jose/commit/51a18b675a771ed573047398f79cd6f70d8f9fec)), closes [#308](https://github.com/panva/jose/issues/308)

## [4.1.4](https://github.com/panva/jose/compare/v4.1.3...v4.1.4) (2021-11-01)


### Fixes

* allow shorter HMAC secrets ([57126f1](https://github.com/panva/jose/commit/57126f1806493a2782647610c2a6b5d20ea3e516))

## [4.1.3](https://github.com/panva/jose/compare/v4.1.2...v4.1.3) (2021-11-01)


### Fixes

* **edge-functions:** don't use globalThis ([3952030](https://github.com/panva/jose/commit/39520302d078da2273b5a24f8254f6c221195c63))

## [4.1.2](https://github.com/panva/jose/compare/v4.1.1...v4.1.2) (2021-10-25)


### Fixes

* **build:** ensure cjs/esm specific packages have the right main entry ([2f4526a](https://github.com/panva/jose/commit/2f4526a22b9bd62727bdd825e326ef79695c8ea3))

## [4.1.1](https://github.com/panva/jose/compare/v4.1.0...v4.1.1) (2021-10-21)


### Fixes

* **typescript:** work around potentially missing global URL from DOM lib ([7ed731c](https://github.com/panva/jose/commit/7ed731c567db6e64f0fbd618efe7e48d812af0c6)), closes [#295](https://github.com/panva/jose/issues/295)

## [4.1.0](https://github.com/panva/jose/compare/v4.0.4...v4.1.0) (2021-10-18)


### Features

* **web:** publish umd and bundle files to cdnjs.com ([3b3100a](https://github.com/panva/jose/commit/3b3100a8f115db5fb7c56482a0c5cf4814e0f838))

## [4.0.4](https://github.com/panva/jose/compare/v4.0.3...v4.0.4) (2021-10-17)


### Fixes

* **web:** check Uint8Array CEK lengths, refactor for better tree-shaking ([e8299f2](https://github.com/panva/jose/commit/e8299f246b1dbf1665d8f1ed141b9bde34684293))

## [4.0.3](https://github.com/panva/jose/compare/v4.0.2...v4.0.3) (2021-10-16)


### Fixes

* **web:** checking cryptokey applicability early ([89dc2aa](https://github.com/panva/jose/commit/89dc2aab99d831e922ba865eccfb29b8229ed767))

## [4.0.2](https://github.com/panva/jose/compare/v4.0.1...v4.0.2) (2021-10-15)


### Fixes

* **typescript:** export ProduceJWT ([#285](https://github.com/panva/jose/issues/285)) ([2b8738e](https://github.com/panva/jose/commit/2b8738e38a4286c9a1411e3aef3159f61427317c))

## [4.0.1](https://github.com/panva/jose/compare/v4.0.0...v4.0.1) (2021-10-14)


### Fixes

* **typescript:** re-export all types from index.d.ts ([d68f104](https://github.com/panva/jose/commit/d68f104d5895f639812b3317696a4616c3e5fb59))

## [4.0.0](https://github.com/panva/jose/compare/v3.20.3...v4.0.0) (2021-10-14)


### ⚠ BREAKING CHANGES

* All module named exports have moved from subpaths to
just "jose". For example, `import { jwtVerify } from 'jose/jwt/verify'`
is now just `import { jwtVerify } from 'jose'`.
* All submodule default exports and named have been
removed in favour of just "jose" named exports.
* **typescript:** remove repeated type re-exports
* The undocumented `jose/util/random` was removed.
* The `jose/jwk/thumbprint` named export
is renamed to `calculateJwkThumbprint`, now
`import { calculateJwkThumbprint } from 'jose'`
* The deprecated `jose/jwk/parse` module was
removed, use `import { importJWK } from 'jose'` instead.
* The deprecated `jose/jwk/from_key_like` module was
removed, use `import { exportJWK } from 'jose'` instead.

### Refactor

* redo exports to support broader tooling ([dd2cf9e](https://github.com/panva/jose/commit/dd2cf9ed2d89488de6dc4536f721887ffc9bb34f))
* remove util/random ([914e47f](https://github.com/panva/jose/commit/914e47fc9b6c207fd7e3469b1c3fac40f7a81031))
* removed the deprecated jwk/from_key_like module ([ec1d0e7](https://github.com/panva/jose/commit/ec1d0e72fe39ec2bccc28e46b5bce2dc17711134))
* removed the deprecated jwk/parse module ([8d3cc3b](https://github.com/panva/jose/commit/8d3cc3bb46e7e87e6511859dce58a651811ca551))
* rename calculateThumprint to calculateJwkThumbprint ([5afb713](https://github.com/panva/jose/commit/5afb713fbb99e6c884bb3b1c68ae2cf490e54595))
* **typescript:** remove repeated type re-exports ([3e137d2](https://github.com/panva/jose/commit/3e137d2427035d18397825074c2ee1e5db97515b))

## [3.20.3](https://github.com/panva/jose/compare/v3.20.2...v3.20.3) (2021-10-14)


### Fixes

* remove clutter when tree shaking browser dist ([73ba370](https://github.com/panva/jose/commit/73ba3708d45e32215c76f17d9982b0f4e20b7f08))
* **typescript:** JWTExpired error TS2417 ([373e0e4](https://github.com/panva/jose/commit/373e0e4b22fb48cefcf14385a19c5ea6a57a849e))

## [3.20.2](https://github.com/panva/jose/compare/v3.20.1...v3.20.2) (2021-10-13)


### Fixes

* allow tree-shaking of errors ([0824301](https://github.com/panva/jose/commit/08243010d922c36d22002e35299ec5710654c695))

## [3.20.1](https://github.com/panva/jose/compare/v3.20.0...v3.20.1) (2021-10-06)


### Fixes

* **typescript:** PEM import functions always resolve a KeyLike, never a Uint8Array ([8ef3a8e](https://github.com/panva/jose/commit/8ef3a8ebb78b592e664102cb593542ae6259d72a))

## [3.20.0](https://github.com/panva/jose/compare/v3.19.0...v3.20.0) (2021-10-06)


### Features

* improve key input type errors, remove dependency on @types/node ([a13eb04](https://github.com/panva/jose/commit/a13eb045d86d96e56f7a250cdc808f8c5aa0e62a))


### Fixes

* proper createRemoteJWKSet timeoutDuration handling ([efa1619](https://github.com/panva/jose/commit/efa16195173f9f66b21d4f41039caaad0ccfa92a)), closes [#277](https://github.com/panva/jose/issues/277)

## [3.19.0](https://github.com/panva/jose/compare/v3.18.0...v3.19.0) (2021-09-26)


### Features

* return resolved key when verify and decrypt resolve functions are used ([49fb62c](https://github.com/panva/jose/commit/49fb62cb96cd9afc854f5102313f16e27c0eb2b4))

## [3.18.0](https://github.com/panva/jose/compare/v3.17.0...v3.18.0) (2021-09-22)


### Features

* add X.509/SPKI/PKCS8 key import and SPKI/PKCS8 export functions ([a2af0f4](https://github.com/panva/jose/commit/a2af0f45fe47b3d73178ab00c18e49fccd2b1432))

## [3.17.0](https://github.com/panva/jose/compare/v3.16.1...v3.17.0) (2021-09-10)


### Features

* **cloudflare workers:** add support for EdDSA using Ed25519 ([0967369](https://github.com/panva/jose/commit/09673694027ffc4961c211c12e0b7eb2ac9966f3))

## [3.16.1](https://github.com/panva/jose/compare/v3.16.0...v3.16.1) (2021-09-08)


### Fixes

* guard Sign payloads and Encrypt plaintext argument types ([10a18f2](https://github.com/panva/jose/commit/10a18f28a0f845e91579afab3573730c9b1ae478))

## [3.16.0](https://github.com/panva/jose/compare/v3.15.5...v3.16.0) (2021-09-07)


### Features

* **node:** support rsa-pss keys in Node.js >= 16.9.0 for sign/verify ([0b112cf](https://github.com/panva/jose/commit/0b112cf63ed2a859806531853c37486485740f9c))

## [3.15.5](https://github.com/panva/jose/compare/v3.15.4...v3.15.5) (2021-09-02)


### Fixes

* omit some fetch options when running in Cloudflare Workers env ([ced065a](https://github.com/panva/jose/commit/ced065aa9754c625ea88a598025962503e078ae9)), closes [#255](https://github.com/panva/jose/issues/255)

## [3.15.4](https://github.com/panva/jose/compare/v3.15.3...v3.15.4) (2021-08-20)


### Fixes

* **deno:** ignore incomplete webcrypto api type errors ([c5f2262](https://github.com/panva/jose/commit/c5f226290ead93b7f43f664fc05c5fec90f38be8))
* **typescript:** generateKeyPair never returns Uint8Array ([73adc01](https://github.com/panva/jose/commit/73adc014ad9827067637153a97f230bfdd72cb9b))

## [3.15.3](https://github.com/panva/jose/compare/v3.15.2...v3.15.3) (2021-08-20)


### Fixes

* **typescript:** GeneralJWSInput and GeneralJWS omit ([bc0b42f](https://github.com/panva/jose/commit/bc0b42f0f58e802721910ac1bc4d62eb704910ff))

## [3.15.2](https://github.com/panva/jose/compare/v3.15.1...v3.15.2) (2021-08-20)

## [3.15.1](https://github.com/panva/jose/compare/v3.15.0...v3.15.1) (2021-08-20)


### Fixes

* **typescript:** remove file extensions from types/**/*.d.ts files ([0c432e5](https://github.com/panva/jose/commit/0c432e554e7b1f0382efefe44c0053a446c9dcc4)), closes [#222](https://github.com/panva/jose/issues/222)

## [3.15.0](https://github.com/panva/jose/compare/v3.14.4...v3.15.0) (2021-08-20)


### Features

* experimental Deno build & publish ([5c7d265](https://github.com/panva/jose/commit/5c7d2656b6e5659a19c6cb3c4fed73e724fe2f6e))


### Fixes

* **typescript:** allow sign results to be passed to verify ([59aa96d](https://github.com/panva/jose/commit/59aa96d28dd259d9d8b03fcf37b5a703c5e36874))

## [3.14.4](https://github.com/panva/jose/compare/v3.14.3...v3.14.4) (2021-08-16)


### Fixes

* throw JWEInvalid when jwe protected header is invalid ([991d435](https://github.com/panva/jose/commit/991d4350d0357ebad17080644c24bccec844c3b9))
* throw JWSInvalid when jws protected header is invalid ([#244](https://github.com/panva/jose/issues/244)) ([1fc79aa](https://github.com/panva/jose/commit/1fc79aa8315fa25e28f63f1c5534d0630fc781dc))

## [3.14.3](https://github.com/panva/jose/compare/v3.14.2...v3.14.3) (2021-07-21)


### Fixes

* **docs:** update doc links again ([26c4361](https://github.com/panva/jose/commit/26c4361c007e3bc7e6ee60b65f9535cecf447fe6))

## [3.14.2](https://github.com/panva/jose/compare/v3.14.1...v3.14.2) (2021-07-21)


### Fixes

* **docs:** update doc links ([86f9134](https://github.com/panva/jose/commit/86f9134248a1746904f4c9f79ee404007ab68858))

## [3.14.1](https://github.com/panva/jose/compare/v3.14.0...v3.14.1) (2021-07-21)


### Fixes

* **typescript:** export generate key pair result interface ([2b5cc28](https://github.com/panva/jose/commit/2b5cc28684bd9cd09de2f774d7326bffe61fe6ea))

## [3.14.0](https://github.com/panva/jose/compare/v3.13.0...v3.14.0) (2021-07-02)


### Features

* add verbose key type error messages ([df56b94](https://github.com/panva/jose/commit/df56b942c64dfdbb14cb860a403742f25ec60b49))


### Fixes

* **typescript:** remove file extensions from .d.ts files ([e091f0f](https://github.com/panva/jose/commit/e091f0f24537541e350e803bd1e657348f428da2)), closes [#222](https://github.com/panva/jose/issues/222)
* AES Key Wrap input type check ([b83821b](https://github.com/panva/jose/commit/b83821b2bf99fe2051d4d4d89fe4ff18a8559722))
* guard SignJWT.prototype.sign() from missing protected header ([4103719](https://github.com/panva/jose/commit/4103719c24d1811306acf7d5290ef15c5afddcfb)), closes [#221](https://github.com/panva/jose/issues/221)
* **typescript:** add "jku" header to JoseHeaderParameters ([#220](https://github.com/panva/jose/issues/220)) ([72a72db](https://github.com/panva/jose/commit/72a72db7723e06994066d6ad154073387c5bc17c))

## [3.13.0](https://github.com/panva/jose/compare/v3.12.3...v3.13.0) (2021-06-22)


### Features

* **typescript:** export consume module interface types ([#213](https://github.com/panva/jose/issues/213)) ([13fa3d8](https://github.com/panva/jose/commit/13fa3d8ae089b21dace0ea22782451ca77941600))

## [3.12.3](https://github.com/panva/jose/compare/v3.12.2...v3.12.3) (2021-06-02)


### Fixes

* **browser:** remove the use of a node std-lib in decodeProtectedHeader ([d9d4a5f](https://github.com/panva/jose/commit/d9d4a5f2e88ca5172ff753a503bfbdb50522d094)), closes [#206](https://github.com/panva/jose/issues/206)

## [3.12.2](https://github.com/panva/jose/compare/v3.12.1...v3.12.2) (2021-05-19)


### Performance

* **node:** use util.types.is* helpers when available ([d36311d](https://github.com/panva/jose/commit/d36311d5162b3500728937bf25bd2c756f8a33d6))

## [3.12.1](https://github.com/panva/jose/compare/v3.12.0...v3.12.1) (2021-05-14)


### Fixes

* **browser:** avoid global-conflicting variable name fetch ([#199](https://github.com/panva/jose/issues/199)) ([b2c6273](https://github.com/panva/jose/commit/b2c6273eccad5e34cbe0219c521c6453ba71e6c4))

## [3.12.0](https://github.com/panva/jose/compare/v3.11.6...v3.12.0) (2021-05-12)


### Features

* **webcrypto:** allow generate* modules extractable: false override ([afae428](https://github.com/panva/jose/commit/afae428f39eb920297ef474878d4266172d9a015))

## [3.11.6](https://github.com/panva/jose/compare/v3.11.5...v3.11.6) (2021-04-30)


### Fixes

* swallow promisified crypto.verify errors ([d512ede](https://github.com/panva/jose/commit/d512ede0730155051707d60ae8c69ba0492d858f))

## [3.11.5](https://github.com/panva/jose/compare/v3.11.4...v3.11.5) (2021-04-13)


### Fixes

* isObject helper in different vm contexts or jest re-assigned globals ([7819df7](https://github.com/panva/jose/commit/7819df73ebf6391377ef3e7623948d8329ac47f5)), closes [#178](https://github.com/panva/jose/issues/178)

## [3.11.4](https://github.com/panva/jose/compare/v3.11.3...v3.11.4) (2021-04-09)


### Fixes

* defer AES CBC w/ HMAC decryption after tag verification passes ([579485c](https://github.com/panva/jose/commit/579485cb806e9989643e32a66752d3235cd43f09))

## [3.11.3](https://github.com/panva/jose/compare/v3.11.2...v3.11.3) (2021-04-01)


### Fixes

* **node:** check CryptoKey algorithm & usage before exporting KeyObject ([dab4b2f](https://github.com/panva/jose/commit/dab4b2f03efc5772773e66fdb757db5571deee4d))

## [3.11.2](https://github.com/panva/jose/compare/v3.11.1...v3.11.2) (2021-03-30)


### Fixes

* assert KeyLike input types, change "any" types to "unknown" ([edb83a8](https://github.com/panva/jose/commit/edb83a846a880d316d77ace485641330dd0debb6))

## [3.11.1](https://github.com/panva/jose/compare/v3.11.0...v3.11.1) (2021-03-26)


### Fixes

* **node:** crypto.verify callback invocation with a private keyobject ([d3d4acd](https://github.com/panva/jose/commit/d3d4acd8be612850999309ef7de86c549d5de9c0))

## [3.11.0](https://github.com/panva/jose/compare/v3.10.0...v3.11.0) (2021-03-24)


### Features

* export error codes as static properties ([89d8003](https://github.com/panva/jose/commit/89d80038755be21228a3455a8feca396e76fbcf5)), closes [#170](https://github.com/panva/jose/issues/170)

## [3.10.0](https://github.com/panva/jose/compare/v3.9.0...v3.10.0) (2021-03-18)


### Features

* **node:** use libuv threadpool to sign in node >= 15.12.0 ([cf5074e](https://github.com/panva/jose/commit/cf5074e7e1333728f7632ee6785cc52ef32711bf))
* **node:** use libuv threadpool to verify in node >= 15.12.0 ([ae9a7f4](https://github.com/panva/jose/commit/ae9a7f4186da9675820dc2e77786b9ee3f7dd0d0))
* **node:** use native JWK export in node >= 15.9.0 ([7f3cc44](https://github.com/panva/jose/commit/7f3cc44bd0508bf15c061500738473eeafdc32d1))
* **node:** use native JWK import in node >= 15.12.0 ([f0c2a64](https://github.com/panva/jose/commit/f0c2a6472844c43a92a79ed90b51cc5133a2e22e))

## [3.9.0](https://github.com/panva/jose/compare/v3.8.0...v3.9.0) (2021-03-15)


### Features

* add named exports for all modules ([5cba6b0](https://github.com/panva/jose/commit/5cba6b0fdddd24c2e48623d8aaf48640b3279a43))

## [3.8.0](https://github.com/panva/jose/compare/v3.7.1...v3.8.0) (2021-03-12)


### Features

* publish alternative Node.js and Browser specific distributions ([7856dad](https://github.com/panva/jose/commit/7856dad1031845bfc3cadfdbe609d0f0154f19ce))

## [3.7.1](https://github.com/panva/jose/compare/v3.7.0...v3.7.1) (2021-03-11)


### Fixes

* swallow invalid signature encoding errors ([e0adf49](https://github.com/panva/jose/commit/e0adf49e5789f9fc23afb1e2bd3e330e34b46b78))

## [3.7.0](https://github.com/panva/jose/compare/v3.6.2...v3.7.0) (2021-03-02)


### Features

* electron >=12.0.0 is now supported (and tested on ci) ([8fffd3e](https://github.com/panva/jose/commit/8fffd3e2e1ec0c5f3517a779b42974a4c1beae27))


### Fixes

* **electron:** only call (de)cipher.setAAD() when aad is not empty ([a5a6c4d](https://github.com/panva/jose/commit/a5a6c4dc9f459b88de5f243cf1d4ea620def8d98))
* **electron:** properly ASN.1 encode [0x00] when converting RSA JWKs ([433f020](https://github.com/panva/jose/commit/433f020246a9131f63705a3e1aa99492dac50947))

## [3.6.2](https://github.com/panva/jose/compare/v3.6.1...v3.6.2) (2021-02-16)


### Fixes

* **typescript:** update maxTokenAge type and examples ([2c358e0](https://github.com/panva/jose/commit/2c358e0ea550f19896ccf43724ee8224aa04a664))

## [3.6.1](https://github.com/panva/jose/compare/v3.6.0...v3.6.1) (2021-02-10)


### Fixes

* node runtime json fetch handles connection errors properly ([fc584b2](https://github.com/panva/jose/commit/fc584b2efd9a6e7bf2ac83c6fb0ddf96fb0ca6a5))

## [3.6.0](https://github.com/panva/jose/compare/v3.5.4...v3.6.0) (2021-02-04)


### Features

* allow CryptoKey instances in a regular non-webcrypto node runtime ([e8d41a9](https://github.com/panva/jose/commit/e8d41a933582495c9a9b02d6ec38b46bef8795e1))

## [3.5.4](https://github.com/panva/jose/compare/v3.5.3...v3.5.4) (2021-01-26)


### Fixes

* export package.json ([8c29107](https://github.com/panva/jose/commit/8c29107aea26a54869d8adadceaf0bbf70fb18cd)), closes [#157](https://github.com/panva/jose/issues/157)

## [3.5.3](https://github.com/panva/jose/compare/v3.5.2...v3.5.3) (2021-01-20)


### Fixes

* workaround downstream dependency issues messing with http ([2e58005](https://github.com/panva/jose/commit/2e5800535ab72ab35f3abfaab7493163d8b0494e)), closes [#154](https://github.com/panva/jose/issues/154)

## [3.5.2](https://github.com/panva/jose/compare/v3.5.1...v3.5.2) (2021-01-18)


### Performance

* use 'base64url' encoding when available in Node.js runtime ([808f06c](https://github.com/panva/jose/commit/808f06cd08b10cf53343afb35802cc6e5b95ea20))
* use KeyObject.prototype asymmetricKeyDetails when available ([ad88ee2](https://github.com/panva/jose/commit/ad88ee2cd5bcaee3c3e5ec79735c8172ae2725be))

## [3.5.1](https://github.com/panva/jose/compare/v3.5.0...v3.5.1) (2021-01-10)


### Fixes

* workaround for RangeError in browser runtime base64url ([ed32b0d](https://github.com/panva/jose/commit/ed32b0d46ee570e405e0d88b43aecd8ef6fea129))

## [3.5.0](https://github.com/panva/jose/compare/v3.4.0...v3.5.0) (2020-12-17)


### Features

* added JWE General JSON Serialization decryption ([16dea9e](https://github.com/panva/jose/commit/16dea9ec7d6179471f794a3463bba0c6e77295ff))

## [3.4.0](https://github.com/panva/jose/compare/v3.3.2...v3.4.0) (2020-12-16)


### Features

* added JWS General JSON Serialization signing ([6fb862c](https://github.com/panva/jose/commit/6fb862cf12d34b7dc5077d1872ad29eeac27d21e)), closes [#129](https://github.com/panva/jose/issues/129)
* added JWS General JSON Serialization verification ([55b7781](https://github.com/panva/jose/commit/55b77810d03a1f7e38e13bec384dece08b74b206)), closes [#129](https://github.com/panva/jose/issues/129)
* added utility function for decoding token's protected header ([fa29d68](https://github.com/panva/jose/commit/fa29d68cfdf0922c7e4dac24eb50161d1eab28d4))

## [3.3.2](https://github.com/panva/jose/compare/v3.3.1...v3.3.2) (2020-12-14)


### Fixes

* **typescript:** ref dom lib via triple-slash to fix some compile issues ([175f273](https://github.com/panva/jose/commit/175f273819785c29b9ad822dcb5d70073523f504)), closes [#126](https://github.com/panva/jose/issues/126)

## [3.3.1](https://github.com/panva/jose/compare/v3.3.0...v3.3.1) (2020-12-06)


### Fixes

* botched v3.3.0 release ([1c3e116](https://github.com/panva/jose/commit/1c3e116976c997f205b917405f010b568d1bd3b9))

## [3.3.0](https://github.com/panva/jose/compare/v3.2.0...v3.3.0) (2020-12-06)


### Features

* support recognizing proprietary `crit` header parameters ([5163116](https://github.com/panva/jose/commit/5163116ca1c091871ed0c601c9fbc1dbe94599cd)), closes [#123](https://github.com/panva/jose/issues/123)


### Fixes

* reject JWTs with b64: false ([691b44a](https://github.com/panva/jose/commit/691b44ad4717c82a06539facfedff48fa0e9c6a9))

## [3.2.0](https://github.com/panva/jose/compare/v3.1.3...v3.2.0) (2020-12-02)


### Features

* allow specifying modulusLength when generating RSA Key Pairs ([5f7a0e9](https://github.com/panva/jose/commit/5f7a0e9055256bce4786a53711bcf14cf59fa8f1)), closes [#121](https://github.com/panva/jose/issues/121)

## [3.1.3](https://github.com/panva/jose/compare/v3.1.2...v3.1.3) (2020-11-26)


### Fixes

* **typescript:** refactored how types are published ([2937363](https://github.com/panva/jose/commit/29373633bc540ff1e7bfe8fb3e5c5b391e79c2d9)), closes [#119](https://github.com/panva/jose/issues/119)

## [3.1.2](https://github.com/panva/jose/compare/v3.1.1...v3.1.2) (2020-11-24)


### Fixes

* handle globalThis undefined in legacy browsers ([b83c59b](https://github.com/panva/jose/commit/b83c59bb43ad14ac932cd0c662f7dfc2c4c62753))

## [3.1.1](https://github.com/panva/jose/compare/v3.1.0...v3.1.1) (2020-11-24)


### Fixes

* global detection in a browser worker runtime ([56ff8fa](https://github.com/panva/jose/commit/56ff8fa65aa045411c6c6a67d80b67c1099576a0))

## [3.1.0](https://github.com/panva/jose/compare/v3.0.2...v3.1.0) (2020-11-22)


### Features

* added "KeyLike to JWK" module ([7a8418e](https://github.com/panva/jose/commit/7a8418eadd68b645fb7edf78873a35980ea8e41d)), closes [#109](https://github.com/panva/jose/issues/109)
* allow compact verify/decrypt tokens to be uint8array encoded ([e39c3db](https://github.com/panva/jose/commit/e39c3dba75e5ae70697e6a4f93096c492a265c07))
* allow http.Agent and https.Agent passed in remote JWK Set ([38494a8](https://github.com/panva/jose/commit/38494a88828a8df2015efa78ca29c1a6317a3a50))

## [3.0.2](https://github.com/panva/jose/compare/v3.0.1...v3.0.2) (2020-11-15)


### Fixes

* **build:** publish esm submodules ([7b6364f](https://github.com/panva/jose/commit/7b6364f26f7654368c9e33af58043ee40e77ec77)), closes [#104](https://github.com/panva/jose/issues/104)

## [3.0.1](https://github.com/panva/jose/compare/v3.0.0...v3.0.1) (2020-11-15)


### Fixes

* **typescript:** fix compiling by adding .d.ts files for runtime modules ([d9cb573](https://github.com/panva/jose/commit/d9cb5734d779df26c3e717a9f4f23d18b856dc5f))

## [3.0.0](https://github.com/panva/jose/compare/v2.0.3...v3.0.0) (2020-11-14)


### ⚠ BREAKING CHANGES

* Revised, Promise-based API
* No dependencies
* Browser support (using [Web Cryptography API](https://www.w3.org/TR/WebCryptoAPI/))
* Support for verification using a remote JWKS endpoint

### Features

* Revised API, No dependencies, Browser Support, Promises ([357fe0b](https://github.com/panva/jose/commit/357fe0b964903e8c84ab49f0f27ddf0447d44c84))

## [2.0.3](https://github.com/panva/jose/compare/v2.0.2...v2.0.3) (2020-10-29)


### Fixes

* allow stubbing of the JWT.decode function ([6c3b92f](https://github.com/panva/jose/commit/6c3b92f4394a5d7092d7336922eda61e311e6f8c))

## [2.0.2](https://github.com/panva/jose/compare/v2.0.1...v2.0.2) (2020-09-14)


### Fixes

* **esm:** include esm files in the published package ([1956746](https://github.com/panva/jose/commit/1956746df6542c00bc33af750f93394805b5d603))

## [2.0.1](https://github.com/panva/jose/compare/v2.0.0...v2.0.1) (2020-09-10)


### Fixes

* allow plugins such as jose-chacha to work in newer node runtime ([30f1dc2](https://github.com/panva/jose/commit/30f1dc2c41e5554d322167b84b610a99bf5e69c5))

## [2.0.0](https://github.com/panva/jose/compare/v1.28.0...v2.0.0) (2020-09-08)


### ⚠ BREAKING CHANGES

* the `JWE.decrypt` option `algorithms` was removed and
replaced with contentEncryptionAlgorithms (handles `enc` allowlist) and
keyManagementAlgorithms (handles `alg` allowlist)
* the `JWT.verify` profile option was removed, use e.g.
`JWT.IdToken.verify` instead.
* removed the `maxAuthAge` `JWT.verify` option, this
option is now only present at the specific JWT profile APIs where the
`auth_time` property applies.
* removed the `nonce` `JWT.verify` option, this
option is now only present at the specific JWT profile APIs where the
`nonce` property applies.
* the `acr`, `amr`, `nonce` and `azp` claim value types
will only be checked when verifying a specific JWT profile using its
dedicated API.
* using the draft implementing APIs will emit a one-time
warning per process using `process.emitWarning`
* `JWT.sign` function options no longer accept a `nonce`
property. To create a JWT with a `nonce` just pass the value to the
payload.
* due to added ESM module support Node.js version with
ESM implementation bugs are no longer supported, this only affects early
v13.x versions. The resulting Node.js semver range is
`>=10.13.0 < 13 || >=13.7.0`
* deprecated method `JWK.importKey` was removed
* deprecated method `JWKS.KeyStore.fromJWKS` was removed
* the use of unregistered curve name P-256K for secp256k1
was removed
* jose.JWE.Encrypt constructor aad and unprotectedHeader
arguments swapped places
* jose.JWE.encrypt.flattened header (unprotectedHeader)
and aad arguments swapped places
* jose.JWE.encrypt.general header (unprotectedHeader)
and aad arguments swapped places
* JWS.verify returned payloads are now always buffers
* JWS.verify options `encoding` and `parse` were removed

### Features

* added support for ESM (ECMAScript modules) ([1aa9035](https://github.com/panva/jose/commit/1aa9035552bbcb34b95e092d0f082cc6d94465ab))
* decrypt allowlists for both key management and content encryption ([30e5c46](https://github.com/panva/jose/commit/30e5c46ecf00a498e65a551ced88bc897531c2a4))


### Fixes

* **typescript:** allow Buffer when verifying detached signature ([cadbd04](https://github.com/panva/jose/commit/cadbd047ca953d6d8171439f2efd7bb98a5d8e73))
* **typescript:** properly type all decode/verify/decrypt fn options ([4c23bd6](https://github.com/panva/jose/commit/4c23bd65fe6fa634726a5eb73c6d590f7348a97e))


### Refactor

* encrypt APIs unprotectedHeader and aad arguments swapped ([70bd4ae](https://github.com/panva/jose/commit/70bd4ae6b2e6ba94bbe0b3dc1a17b2990af3a18b))
* move JWT profile specifics outside of generic JWT ([fd69d7f](https://github.com/panva/jose/commit/fd69d7f5093d0b3a231d7d79aa3bca3a8a64464c))
* removed `nonce` option from `JWT.sign` ([c4267cc](https://github.com/panva/jose/commit/c4267cc655bc2721d846c98f8a40640d1a12e9ad))
* removed deprecated methods and utilities ([6c35c51](https://github.com/panva/jose/commit/6c35c519c9181f8246b36ad02572adb609d6de1d))
* removed payload parsing from JWS.verify ([ba5c897](https://github.com/panva/jose/commit/ba5c89791915a2a3cd56b3dab1f3328778152d33))

## [1.28.0](https://github.com/panva/jose/compare/v1.27.3...v1.28.0) (2020-08-10)


### Features

* support for validating issuer from a list of values ([#91](https://github.com/panva/jose/issues/91)) ([ce6836a](https://github.com/panva/jose/commit/ce6836af88c9e73c29560233f15ed1760c7dcc13))



## [1.27.3](https://github.com/panva/jose/compare/v1.27.2...v1.27.3) (2020-08-04)


### Fixes

* do not mutate unencoded payload when signing for multiple parties ([1695423](https://github.com/panva/jose/commit/169542363f884e4028db9f80086d631e626eb469)), closes [#89](https://github.com/panva/jose/issues/89)
* ensure "b64" is the same for all recipients edge cases ([d56ec9f](https://github.com/panva/jose/commit/d56ec9f5ddc2612e5ff21fe35d45a56e7153e0e4))



## [1.27.2](https://github.com/panva/jose/compare/v1.27.1...v1.27.2) (2020-07-01)


### Fixes

* handle private EC keys without public component ([#86](https://github.com/panva/jose/issues/86)) ([e8ad389](https://github.com/panva/jose/commit/e8ad38993e29747098f7fd1594dde4ce893ba802)), closes [#85](https://github.com/panva/jose/issues/85)



## [1.27.1](https://github.com/panva/jose/compare/v1.27.0...v1.27.1) (2020-06-01)


### Fixes

* allow any JSON numeric value for timestamp values ([7ba4922](https://github.com/panva/jose/commit/7ba492237aaf788914166c134d50fb046041efa0))



## [1.27.0](https://github.com/panva/jose/compare/v1.26.1...v1.27.0) (2020-05-05)


### Features

* add opt-in objects to verify using embedded JWS Header public keys ([7c1cab1](https://github.com/panva/jose/commit/7c1cab196edc409ec6cc4741bdf7e06c5aaf5dab))



## [1.26.1](https://github.com/panva/jose/compare/v1.26.0...v1.26.1) (2020-04-27)


### Fixes

* **typescript:** types of key generate functions without overloads ([7e60722](https://github.com/panva/jose/commit/7e60722ae7054f8acf833e015c22679d56fbc0ca)), closes [#80](https://github.com/panva/jose/issues/80)
* "typ" content-type validation, case insensitive and handled prefix ([0691586](https://github.com/panva/jose/commit/06915861b32c0ae252dcc84791050bc3716ce102))



## [1.26.0](https://github.com/panva/jose/compare/v1.25.2...v1.26.0) (2020-04-16)


### Features

* update JWT Profile for OAuth 2.0 Access Tokens to latest draft ([8c0a8a9](https://github.com/panva/jose/commit/8c0a8a950e4503cb7a756589e307286fe1116b05))


### BREAKING CHANGES

* `at+JWT` JWT draft profile - in the draft's Section 2.2
the claims `iat` and `jti` are now REQUIRED (was RECOMMENDED).



## [1.25.2](https://github.com/panva/jose/compare/v1.25.1...v1.25.2) (2020-04-15)


### Fixes

* **build:** don't publish junk files ([6e98c1a](https://github.com/panva/jose/commit/6e98c1a5f994224b9412fc47c4065b468c89fe2c))



## [1.25.1](https://github.com/panva/jose/compare/v1.25.0...v1.25.1) (2020-04-15)


### Fixes

* use native openssl AES Key Wrap 🤦 ([dcf8d75](https://github.com/panva/jose/commit/dcf8d75a8aca4f05fe04df64fdd2ba50bbc75bc9))



## [1.25.0](https://github.com/panva/jose/compare/v1.24.1...v1.25.0) (2020-03-11)


### Features

* update JWT Profile for OAuth 2.0 Access Tokens to latest draft ([bc77a15](https://github.com/panva/jose/commit/bc77a15fab10f8a29561ef667a923b2f074fa9b3))



## [1.24.1](https://github.com/panva/jose/compare/v1.24.0...v1.24.1) (2020-03-05)


### Fixes

* allow importing simpler passphrases as `oct` keys ([f86bda3](https://github.com/panva/jose/commit/f86bda3bb709f29e4264fb8de45242f518128744))



## [1.24.0](https://github.com/panva/jose/compare/v1.23.0...v1.24.0) (2020-02-25)


### Features

* add JWT.verify "typ" option for checking JWT Type Header parameter ([fc08426](https://github.com/panva/jose/commit/fc08426466233709b442ba21232768ddeeb94e56))



## [1.23.0](https://github.com/panva/jose/compare/v1.22.2...v1.23.0) (2020-02-18)


### Fixes

* **typescript:** add optional JWK.Key props and make them readonly ([b92079c](https://github.com/panva/jose/commit/b92079cb64216b8ea91082adc07ac03972dbbb0e)), closes [#67](https://github.com/panva/jose/issues/67)


### Features

* add ECDH-ES with X25519 and X448 OKP keys ([38369ea](https://github.com/panva/jose/commit/38369ea3d72812abe7ecebd6dc7da164b0a2e29d))
* add RSA-OAEP-384 and RSA-OAEP-512 JWE Key Management Algorithms ([7477f08](https://github.com/panva/jose/commit/7477f0831b38765a9a916b35b1d40aaf11f0e6b8))



## [1.22.2](https://github.com/panva/jose/compare/v1.22.1...v1.22.2) (2020-02-06)


### Performance Improvements

* various codepaths refactored ([3e3d7dd](https://github.com/panva/jose/commit/3e3d7dd38168159e188e54c48a9f83e3a02a8fe1))



## [1.22.1](https://github.com/panva/jose/compare/v1.22.0...v1.22.1) (2020-02-03)


### Fixes

* actually remove the base64url proper encoding check ([eae01b5](https://github.com/panva/jose/commit/eae01b57ab9f33e8c621ffcd2a77d513a51d22b2))



## [1.22.0](https://github.com/panva/jose/compare/v1.21.1...v1.22.0) (2020-01-29)


### Features

* keystore filtering by JWK Key thumbprint ([a9f6f71](https://github.com/panva/jose/commit/a9f6f7135005d6231d6f42d95c02414139a89d17))


### Performance Improvements

* base64url decode, JWT.verify, JWK.Key instance re-use ([470b4c7](https://github.com/panva/jose/commit/470b4c73154e1fcf8b92726d521940e5e11c9d94))



## [1.21.1](https://github.com/panva/jose/compare/v1.21.0...v1.21.1) (2020-01-25)


### Fixes

* contactKDF iteration count fixed for key sizes larger than 256 bits ([70ff222](https://github.com/panva/jose/commit/70ff22227ad303e57228dc8351688531499a833a))



## [1.21.0](https://github.com/panva/jose/compare/v1.20.0...v1.21.0) (2020-01-23)


### Fixes

* **typescript:** don't expose non existant classes, fix decode key ([0f8bf88](https://github.com/panva/jose/commit/0f8bf886da1b5d02cd0d968d0ec02a58673df258))


### Features

* add opt-in support for Unsecured JWS algorithm "none" ([3a6d17f](https://github.com/panva/jose/commit/3a6d17fdd18d8bbd074c07c2dd08f0406c16a8f1))



## [1.20.0](https://github.com/panva/jose/compare/v1.19.0...v1.20.0) (2020-01-16)


### Features

* add JWTExpired error and JWTClaimInvalid claim and reason props ([a0c0c7a](https://github.com/panva/jose/commit/a0c0c7ad70f42d9b23b3e71de43599a8ac6fe1ff)), closes [#62](https://github.com/panva/jose/issues/62)



## [1.19.0](https://github.com/panva/jose/compare/v1.18.2...v1.19.0) (2020-01-13)


### Features

* exposed shorthands for JWT verification profiles ([b1864e3](https://github.com/panva/jose/commit/b1864e319d1a7a42eadfa0c4b0145952e7814726))



## [1.18.2](https://github.com/panva/jose/compare/v1.18.1...v1.18.2) (2020-01-08)


### Fixes

* ensure asn1.js version to remove Buffer deprecation notice ([13b1106](https://github.com/panva/jose/commit/13b1106048fdeae00b09d54f05245dded85b14a7))
* expose JOSENotSupported key import errors on unsupported runtimes ([bc81e5d](https://github.com/panva/jose/commit/bc81e5dec2987f6ce6dc3fa5daa23dfe620c0a34))
* typo in JOSENotSupported error when x509 certs are not supported ([bb58c9c](https://github.com/panva/jose/commit/bb58c9ce52e807ca4cfad6bcbf1ab96b91778b1f))



## [1.18.1](https://github.com/panva/jose/compare/v1.18.0...v1.18.1) (2020-01-01)


### Fixes

* force iat past check when maxTokenAge option is used + JWT refactor ([828ad5a](https://github.com/panva/jose/commit/828ad5a33dc0cc0049923b69f43f97463295456e))



## [1.18.0](https://github.com/panva/jose/compare/v1.17.2...v1.18.0) (2019-12-31)


### Features

* add JWT validation profiles for Access Tokens and Logout Tokens ([7bb5c95](https://github.com/panva/jose/commit/7bb5c953a9c6d9bd915e8ebc0608bc0649427745))



## [1.17.2](https://github.com/panva/jose/compare/v1.17.1...v1.17.2) (2019-12-17)


### Fixes

* skip validating iat is in the past when exp is present ([0ed5025](https://github.com/panva/jose/commit/0ed5025de30a754de95ae2587ce0f4573909b006))



## [1.17.1](https://github.com/panva/jose/compare/v1.17.0...v1.17.1) (2019-12-10)


### Fixes

* properly fail to import unsupported openssh keys ([bee5744](https://github.com/panva/jose/commit/bee574457f29597ccab09d51ac61b85dd7a7146a))



## [1.17.0](https://github.com/panva/jose/compare/v1.16.2...v1.17.0) (2019-12-10)


### Features

* importing a certificate populates x5c and x5t thumbprints ([25a7a71](https://github.com/panva/jose/commit/25a7a71915c4f7514536cec9e7e162d0ad3b670c)), closes [#59](https://github.com/panva/jose/issues/59)



## [1.16.2](https://github.com/panva/jose/compare/v1.16.1...v1.16.2) (2019-12-05)


### Fixes

* handle Unencoded Payload (b64:false) with arbitrary buffer payloads ([daabedc](https://github.com/panva/jose/commit/daabedc776617f4fde427b3a5e79d8c176293132)), closes [#57](https://github.com/panva/jose/issues/57)



## [1.16.1](https://github.com/panva/jose/compare/v1.16.0...v1.16.1) (2019-12-05)


### Fixes

* allow PBES2 for the correct JWK `use` values ([f0d7194](https://github.com/panva/jose/commit/f0d719416ec9ca041ea88b8a983b5d899a6aa107))



## [1.16.0](https://github.com/panva/jose/compare/v1.15.1...v1.16.0) (2019-12-04)


### Features

* two official jose plugins/extensions for those living on the edge ([5b27c97](https://github.com/panva/jose/commit/5b27c97ac8836ffa9f3880e009c8db5afbfbaa2c)), closes [#56](https://github.com/panva/jose/issues/56)



## [1.15.1](https://github.com/panva/jose/compare/v1.15.0...v1.15.1) (2019-11-30)


### Fixes

* **typescript:** export Key Input types ([0277fcd](https://github.com/panva/jose/commit/0277fcd1896af497e79190212b0719f7e62366c1))



## [1.15.0](https://github.com/panva/jose/compare/v1.14.0...v1.15.0) (2019-11-27)


### Fixes

* default JWT.sign `kid` option value is false for HMAC signatures ([ce77388](https://github.com/panva/jose/commit/ce7738825403f8cdb8f99cb51c096baf0dfa3af7))


### Features

* allow JWK.asKey inputs for sign/verify/encrypt/decrypt operations ([5e1009a](https://github.com/panva/jose/commit/5e1009a63e4bc829009cc46d6295c00f8431024c))



## [1.14.0](https://github.com/panva/jose/compare/v1.13.0...v1.14.0) (2019-11-26)


### Features

* allow JWKS.KeyStore .all and .get to filter for key curves ([ea60338](https://github.com/panva/jose/commit/ea60338ca6f58f2626992a38da76812477ce4540))



## [1.13.0](https://github.com/panva/jose/compare/v1.12.1...v1.13.0) (2019-11-23)


### Features

* return the CEK from JWE.decrypt operation with { complete: true } ([c3eb845](https://github.com/panva/jose/commit/c3eb8450b98b2f5ecc127d69afe85a7ae2cc5aaa))



## [1.12.1](https://github.com/panva/jose/compare/v1.12.0...v1.12.1) (2019-11-14)



## [1.12.0](https://github.com/panva/jose/compare/v1.11.0...v1.12.0) (2019-11-05)


### Features

* add JWS.verify encoding and parsing options ([6bb66d4](https://github.com/panva/jose/commit/6bb66d4f0b4c96f2da8ac5f14fda6bc4f53f2994))



## [1.11.0](https://github.com/panva/jose/compare/v1.10.2...v1.11.0) (2019-11-03)


### Features

* expose crypto.KeyObject instances in supported runtimes ([8ea9683](https://github.com/panva/jose/commit/8ea968312e97ed0f992fab909a20e7993159ec45))



## [1.10.2](https://github.com/panva/jose/compare/v1.10.1...v1.10.2) (2019-10-29)


### Fixes

* only use secp256k1 keys for signing/verification ([9588223](https://github.com/panva/jose/commit/95882232d6d409a321b6a8c168f5b78ebbdabf95))



## [1.10.1](https://github.com/panva/jose/compare/v1.10.0...v1.10.1) (2019-10-04)


### Fixes

* throw proper error when runtime doesn't support OKP ([0a16efb](https://github.com/panva/jose/commit/0a16efb)), closes [#48](https://github.com/panva/jose/issues/48)



## [1.10.0](https://github.com/panva/jose/compare/v1.9.2...v1.10.0) (2019-10-01)


### Features

* rename package ([26f4cf2](https://github.com/panva/jose/commit/26f4cf2))



## [1.9.2](https://github.com/panva/jose/compare/v1.9.1...v1.9.2) (2019-09-16)


### Fixes

* keystore.toJWKS(true) does not throw on public keys ([81abdfa](https://github.com/panva/jose/commit/81abdfa)), closes [#42](https://github.com/panva/jose/issues/42)



## [1.9.1](https://github.com/panva/jose/compare/v1.9.0...v1.9.1) (2019-09-10)



## [1.9.0](https://github.com/panva/jose/compare/v1.8.0...v1.9.0) (2019-08-24)


### Features

* allow JWKS.asKeyStore to swallow errors ([78398d3](https://github.com/panva/jose/commit/78398d3))



## [1.8.0](https://github.com/panva/jose/compare/v1.7.0...v1.8.0) (2019-08-22)


### Features

* added Node.js lts/dubnium support for runtime supported features ([67a8601](https://github.com/panva/jose/commit/67a8601))



## [1.7.0](https://github.com/panva/jose/compare/v1.6.1...v1.7.0) (2019-08-20)


### Features

* add RSA-OAEP-256 support (when a node version supports it) ([28d7cf8](https://github.com/panva/jose/commit/28d7cf8)), closes [#29](https://github.com/panva/jose/issues/29)



## [1.6.1](https://github.com/panva/jose/compare/v1.6.0...v1.6.1) (2019-07-29)


### Fixes

* properly pad calculated RSA primes ([dd121ce](https://github.com/panva/jose/commit/dd121ce))



## [1.6.0](https://github.com/panva/jose/compare/v1.5.2...v1.6.0) (2019-07-27)


### Fixes

* use the correct ECPrivateKey version when importing EC JWK ([24acd20](https://github.com/panva/jose/commit/24acd20))


### Features

* electron v6.x support ([e7ad82c](https://github.com/panva/jose/commit/e7ad82c))



## [1.5.2](https://github.com/panva/jose/compare/v1.5.1...v1.5.2) (2019-07-27)


### Fixes

* importing x5c in electron requires the input split ([181fd09](https://github.com/panva/jose/commit/181fd09))



## [1.5.1](https://github.com/panva/jose/compare/v1.5.0...v1.5.1) (2019-07-27)


### Fixes

* correctly pad integers when importing RSA JWK ([1dc7f35](https://github.com/panva/jose/commit/1dc7f35))



## [1.5.0](https://github.com/panva/jose/compare/v1.4.1...v1.5.0) (2019-07-23)


### Features

* validate JWTs according to a JWT profile - ID Token ([6c98b61](https://github.com/panva/jose/commit/6c98b61))



## [1.4.1](https://github.com/panva/jose/compare/v1.4.0...v1.4.1) (2019-07-14)


### Fixes

* honour the JWT.sign `jti` option ([36c9ce2](https://github.com/panva/jose/commit/36c9ce2)), closes [#33](https://github.com/panva/jose/issues/33)



## [1.4.0](https://github.com/panva/jose/compare/v1.3.0...v1.4.0) (2019-07-08)


### Features

* add secp256k1 EC Key curve and ES256K ([211d7af](https://github.com/panva/jose/commit/211d7af))



## [1.3.0](https://github.com/panva/jose/compare/v1.0.2...c51dc28) (2019-06-21)


### Features

* compute private RSA key p, q, dp, dq, qi when omitted ([6e3d6fd](https://github.com/panva/jose/commit/6e3d6fd)), closes [#26](https://github.com/panva/jose/issues/26)
* add support for JWK x5c, x5t and x5t#S256 ([9d46c48](https://github.com/panva/jose/commit/9d46c48))
* instances of JWKS.KeyStore are now iterable (e.g. for ... of) ([2eae293](https://github.com/panva/jose/commit/2eae293))

### Fixes

* limit calculation of missing RSA private components ([5b53cb0](https://github.com/panva/jose/commit/5b53cb0))
* reject rsa keys without all factors and exponents with a specific message ([b0ff436](https://github.com/panva/jose/commit/b0ff436))

### Deprecations

- this deprecates the use of `JWK.importKey` in favor of
`JWK.asKey`
- this deprecates the use of `JWKS.KeyStore.fromJWKS` in favor of
`JWKS.asKeyStore`

Both `JWK.importKey` and `JWKS.KeyStore.fromJWKS` could have resulted
in the process getting blocked when large bitsize RSA private keys
were missing their components and could also result in an endless
calculation loop when the private key's private exponent was outright
invalid or tampered with.

The new methods still allow to import private RSA keys with these
optimization key parameters missing but it is disabled by default and one
should choose to enable it when working with keys from trusted sources

It is recommended not to use `jose` versions with this feature in
its original on-by-default form - v1.1.0 and v1.2.0



## [1.0.2](https://github.com/panva/jose/compare/v1.0.1...v1.0.2) (2019-05-13)


### Fixes

* add missing keystore.toJWKS() .d.ts definition ([c7a8606](https://github.com/panva/jose/commit/c7a8606)), closes [#25](https://github.com/panva/jose/issues/25)



## [1.0.1](https://github.com/panva/jose/compare/v1.0.0...v1.0.1) (2019-04-27)


### Fixes

* oct key ts "k" type fix ([0750d2c](https://github.com/panva/jose/commit/0750d2c))



## [1.0.0](https://github.com/panva/jose/compare/v0.12.0...v1.0.0) (2019-04-23)


### Fixes

* fail to import invalid PEM formatted strings and buffers ([857dc2b](https://github.com/panva/jose/commit/857dc2b))


### Features

* add JWK key_ops support, fix .algorithms() op returns ([23b874c](https://github.com/panva/jose/commit/23b874c))
* add key.toPEM() export function with optional encryption ([1159b0d](https://github.com/panva/jose/commit/1159b0d))
* add OKP Key and EdDSA sign/verify support ([2dbd3ed](https://github.com/panva/jose/commit/2dbd3ed)), closes [#12](https://github.com/panva/jose/issues/12)


### BREAKING CHANGES

* key.algorithms(op) un+wrapKey was split into correct
wrapKey/unwrapKey/deriveKey returns
* keystore.all and keystore.get `operation` option was
removed, `key_ops: string[]` supersedes it
* Node.js minimal version is now v12.0.0 due to its
added EdDSA support (crypto.sign, crypto.verify and eddsa key objects)



## [0.12.0](https://github.com/panva/jose/compare/v0.11.5...v0.12.0) (2019-04-07)


### Reverts

* add EC P-256K JWK and ES256K sign/verify support ([e21fea1](https://github.com/panva/jose/commit/e21fea1))


### BREAKING CHANGES

* removing ES256K alg and EC P-256K crv support until the
IETF WG decides on what the final names will be.



## [0.11.5](https://github.com/panva/jose/compare/v0.11.4...v0.11.5) (2019-04-04)


### Features

* add key.secret<boolean> and key.type<string> for completeness ([2dd7053](https://github.com/panva/jose/commit/2dd7053))
* add key.thumbprint always returning the JWK Thumbprint (RFC7638) ([65db7e0](https://github.com/panva/jose/commit/65db7e0))



## [0.11.4](https://github.com/panva/jose/compare/v0.11.3...v0.11.4) (2019-03-28)


### Fixes

* properly restrict EC curves in generate(Sync) ([764b863](https://github.com/panva/jose/commit/764b863))
* remove unintended exposure of private material via enumerables ([946d9df](https://github.com/panva/jose/commit/946d9df))



## [0.11.3](https://github.com/panva/jose/compare/v0.11.2...v0.11.3) (2019-03-27)


### Fixes

* throw on unsupported EC curves ([cfa4222](https://github.com/panva/jose/commit/cfa4222))


### Features

* add EC P-256K JWK and ES256K sign/verify support ([2e33e1c](https://github.com/panva/jose/commit/2e33e1c))



## [0.11.2](https://github.com/panva/jose/compare/v0.11.1...v0.11.2) (2019-03-19)


### Fixes

* internal symbol method is now really a symbol ([925d47c](https://github.com/panva/jose/commit/925d47c))
* key.toJWK() fixed on windows ([57f1692](https://github.com/panva/jose/commit/57f1692)), closes [#17](https://github.com/panva/jose/issues/17)


## [0.11.1](https://github.com/panva/jose/compare/v0.11.0...v0.11.1) (2019-03-17)


### Fixes

* restrict RS key algorithms by the key's bit size ([9af295b](https://github.com/panva/jose/commit/9af295b))


## [0.11.0](https://github.com/panva/jose/compare/v0.10.0...v0.11.0) (2019-03-16)


### Fixes

* all JWA defined RSA operations require key of 2048 or more ([cc70c5d](https://github.com/panva/jose/commit/cc70c5d))
* use correct salt length for RSASSA-PSS ([e936d54](https://github.com/panva/jose/commit/e936d54))


### BREAKING CHANGES

* all [JWA](https://www.rfc-editor.org/rfc/rfc7518) defined
RSA based operations require key size of 2048 bits or more.



## [0.10.0](https://github.com/panva/jose/compare/v0.9.2...v0.10.0) (2019-03-12)


### Fixes

* do not list "dir" under wrap/unwrapKey operations ([17b37d3](https://github.com/panva/jose/commit/17b37d3))


### Features

* keystore .all and .get operation option ([d349ba9](https://github.com/panva/jose/commit/d349ba9))


### BREAKING CHANGES

* "dir" is no longer returned as wrap/unwrapKey key
operation



## [0.9.2](https://github.com/panva/jose/compare/v0.9.1...v0.9.2) (2019-03-05)


### Fixes

* "dir" is only available on keys with correct lengths ([6854860](https://github.com/panva/jose/commit/6854860))
* do not 'in' operator when importing keys as string ([be3f4e4](https://github.com/panva/jose/commit/be3f4e4))



## [0.9.1](https://github.com/panva/jose/compare/v0.9.0...v0.9.1) (2019-03-02)


### Fixes

* only import RSA, EC and oct successfully ([e5e02fc](https://github.com/panva/jose/commit/e5e02fc))


# 0.9.0 (2019-03-02)

Initial release

### Implemented Features

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key (JWK) Thumbprint - [RFC7638][spec-thumbprint]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]

| JWK Key Types | Supported ||
| -- | -- | -- |
| RSA | ✓ | RSA |
| Elliptic Curve | ✓ | EC |
| Octet sequence | ✓ | oct |

| Serialization | JWS Sign | JWS Verify | JWE Encrypt | JWE Decrypt |
| -- | -- | -- | -- | -- |
| Compact | ✓ | ✓ | ✓ | ✓ |
| General JSON | ✓ | ✓ | ✓ | ✓ |
| Flattened JSON  | ✓ | ✓ | ✓ | ✓ |

| JWS Algorithms | Supported ||
| -- | -- | -- |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| ECDSA | ✓ | ES256, ES384, ES512 |
| HMAC with SHA-2 | ✓ | HS256, HS384, HS512 |

| JWE Key Management Algorithms | Supported ||
| -- | -- | -- |
| AES | ✓ | A128KW, A192KW, A256KW |
| AES GCM | ✓ | A128GCMKW, A192GCMKW, A256GCMKW |
| Direct Key Agreement | ✓ | dir |
| RSAES OAEP | ✓<sup>*</sup> | RSA-OAEP <sub>(<sup>*</sup>RSA-OAEP-256 is not supported due to its lack of support in Node.js)</sub> |
| RSAES-PKCS1-v1_5 | ✓ | RSA1_5 |
| PBES2 | ✓ | PBES2-HS256+A128KW, PBES2-HS384+A192KW, PBES2-HS512+A256KW |
| ECDH-ES | ✓ | ECDH-ES, ECDH-ES+A128KW, ECDH-ES+A192KW, ECDH-ES+A256KW |

| JWE Content Encryption Algorithms | Supported ||
| -- | -- | -- |
| AES GCM | ✓ | A128GCM, A192GCM, A256GCM |
| AES_CBC_HMAC_SHA2 | ✓ |  A128CBC-HS256, A192CBC-HS384, A256CBC-HS512 |

[spec-b64]: https://www.rfc-editor.org/rfc/rfc7797
[spec-jwa]: https://www.rfc-editor.org/rfc/rfc7518
[spec-jwe]: https://www.rfc-editor.org/rfc/rfc7516
[spec-jwk]: https://www.rfc-editor.org/rfc/rfc7517
[spec-jws]: https://www.rfc-editor.org/rfc/rfc7515
[spec-jwt]: https://www.rfc-editor.org/rfc/rfc7519
[spec-thumbprint]: https://www.rfc-editor.org/rfc/rfc7638
