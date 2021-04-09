# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.5](https://github.com/panva/jose/compare/v2.0.4...v2.0.5) (2021-04-09)


### Bug Fixes

* defer AES CBC w/ HMAC decryption after tag verification passes ([812e03f](https://github.com/panva/jose/commit/812e03fcf4963791ffd9a46417beea5a7a74d995))

## [2.0.4](https://github.com/panva/jose/compare/v2.0.3...v2.0.4) (2021-01-18)


### Performance

* improve base64url encoding when available in Node.js ([d5af559](https://github.com/panva/jose/commit/d5af559a94f51ee82951e1def5c5c5749dfa290a))

## [2.0.3](https://github.com/panva/jose/compare/v2.0.2...v2.0.3) (2020-10-29)


### Bug Fixes

* allow stubbing of the JWT.decode function ([6c3b92f](https://github.com/panva/jose/commit/6c3b92f4394a5d7092d7336922eda61e311e6f8c))

## [2.0.2](https://github.com/panva/jose/compare/v2.0.1...v2.0.2) (2020-09-14)


### Bug Fixes

* **esm:** include esm files in the published package ([1956746](https://github.com/panva/jose/commit/1956746df6542c00bc33af750f93394805b5d603))

## [2.0.1](https://github.com/panva/jose/compare/v2.0.0...v2.0.1) (2020-09-10)


### Bug Fixes

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


### Bug Fixes

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


### Bug Fixes

* do not mutate unencoded payload when signing for multiple parties ([1695423](https://github.com/panva/jose/commit/169542363f884e4028db9f80086d631e626eb469)), closes [#89](https://github.com/panva/jose/issues/89)
* ensure "b64" is the same for all recipients edge cases ([d56ec9f](https://github.com/panva/jose/commit/d56ec9f5ddc2612e5ff21fe35d45a56e7153e0e4))



## [1.27.2](https://github.com/panva/jose/compare/v1.27.1...v1.27.2) (2020-07-01)


### Bug Fixes

* handle private EC keys without public component ([#86](https://github.com/panva/jose/issues/86)) ([e8ad389](https://github.com/panva/jose/commit/e8ad38993e29747098f7fd1594dde4ce893ba802)), closes [#85](https://github.com/panva/jose/issues/85)



## [1.27.1](https://github.com/panva/jose/compare/v1.27.0...v1.27.1) (2020-06-01)


### Bug Fixes

* allow any JSON numeric value for timestamp values ([7ba4922](https://github.com/panva/jose/commit/7ba492237aaf788914166c134d50fb046041efa0))



## [1.27.0](https://github.com/panva/jose/compare/v1.26.1...v1.27.0) (2020-05-05)


### Features

* add opt-in objects to verify using embedded JWS Header public keys ([7c1cab1](https://github.com/panva/jose/commit/7c1cab196edc409ec6cc4741bdf7e06c5aaf5dab))



## [1.26.1](https://github.com/panva/jose/compare/v1.26.0...v1.26.1) (2020-04-27)


### Bug Fixes

* **typescript:** types of key generate functions without overloads ([7e60722](https://github.com/panva/jose/commit/7e60722ae7054f8acf833e015c22679d56fbc0ca)), closes [#80](https://github.com/panva/jose/issues/80)
* "typ" content-type validation, case insensitive and handled prefix ([0691586](https://github.com/panva/jose/commit/06915861b32c0ae252dcc84791050bc3716ce102))



## [1.26.0](https://github.com/panva/jose/compare/v1.25.2...v1.26.0) (2020-04-16)


### Features

* update JWT Profile for OAuth 2.0 Access Tokens to latest draft ([8c0a8a9](https://github.com/panva/jose/commit/8c0a8a950e4503cb7a756589e307286fe1116b05))


### BREAKING CHANGES

* `at+JWT` JWT draft profile - in the draft's Section 2.2
the claims `iat` and `jti` are now REQUIRED (was RECOMMENDED).



## [1.25.2](https://github.com/panva/jose/compare/v1.25.1...v1.25.2) (2020-04-15)


### Bug Fixes

* **build:** don't publish junk files ([6e98c1a](https://github.com/panva/jose/commit/6e98c1a5f994224b9412fc47c4065b468c89fe2c))



## [1.25.1](https://github.com/panva/jose/compare/v1.25.0...v1.25.1) (2020-04-15)


### Bug Fixes

* use native openssl AES Key Wrap 🤦 ([dcf8d75](https://github.com/panva/jose/commit/dcf8d75a8aca4f05fe04df64fdd2ba50bbc75bc9))



## [1.25.0](https://github.com/panva/jose/compare/v1.24.1...v1.25.0) (2020-03-11)


### Features

* update JWT Profile for OAuth 2.0 Access Tokens to latest draft ([bc77a15](https://github.com/panva/jose/commit/bc77a15fab10f8a29561ef667a923b2f074fa9b3))



## [1.24.1](https://github.com/panva/jose/compare/v1.24.0...v1.24.1) (2020-03-05)


### Bug Fixes

* allow importing simpler passphrases as `oct` keys ([f86bda3](https://github.com/panva/jose/commit/f86bda3bb709f29e4264fb8de45242f518128744))



## [1.24.0](https://github.com/panva/jose/compare/v1.23.0...v1.24.0) (2020-02-25)


### Features

* add JWT.verify "typ" option for checking JWT Type Header parameter ([fc08426](https://github.com/panva/jose/commit/fc08426466233709b442ba21232768ddeeb94e56))



## [1.23.0](https://github.com/panva/jose/compare/v1.22.2...v1.23.0) (2020-02-18)


### Bug Fixes

* **typescript:** add optional JWK.Key props and make them readonly ([b92079c](https://github.com/panva/jose/commit/b92079cb64216b8ea91082adc07ac03972dbbb0e)), closes [#67](https://github.com/panva/jose/issues/67)


### Features

* add ECDH-ES with X25519 and X448 OKP keys ([38369ea](https://github.com/panva/jose/commit/38369ea3d72812abe7ecebd6dc7da164b0a2e29d))
* add RSA-OAEP-384 and RSA-OAEP-512 JWE Key Management Algorithms ([7477f08](https://github.com/panva/jose/commit/7477f0831b38765a9a916b35b1d40aaf11f0e6b8))



## [1.22.2](https://github.com/panva/jose/compare/v1.22.1...v1.22.2) (2020-02-06)


### Performance Improvements

* various codepaths refactored ([3e3d7dd](https://github.com/panva/jose/commit/3e3d7dd38168159e188e54c48a9f83e3a02a8fe1))



## [1.22.1](https://github.com/panva/jose/compare/v1.22.0...v1.22.1) (2020-02-03)


### Bug Fixes

* actually remove the base64url proper encoding check ([eae01b5](https://github.com/panva/jose/commit/eae01b57ab9f33e8c621ffcd2a77d513a51d22b2))



## [1.22.0](https://github.com/panva/jose/compare/v1.21.1...v1.22.0) (2020-01-29)


### Features

* keystore filtering by JWK Key thumbprint ([a9f6f71](https://github.com/panva/jose/commit/a9f6f7135005d6231d6f42d95c02414139a89d17))


### Performance Improvements

* base64url decode, JWT.verify, JWK.Key instance re-use ([470b4c7](https://github.com/panva/jose/commit/470b4c73154e1fcf8b92726d521940e5e11c9d94))



## [1.21.1](https://github.com/panva/jose/compare/v1.21.0...v1.21.1) (2020-01-25)


### Bug Fixes

* contactKDF iteration count fixed for key sizes larger than 256 bits ([70ff222](https://github.com/panva/jose/commit/70ff22227ad303e57228dc8351688531499a833a))



## [1.21.0](https://github.com/panva/jose/compare/v1.20.0...v1.21.0) (2020-01-23)


### Bug Fixes

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


### Bug Fixes

* ensure asn1.js version to remove Buffer deprecation notice ([13b1106](https://github.com/panva/jose/commit/13b1106048fdeae00b09d54f05245dded85b14a7))
* expose JOSENotSupported key import errors on unsupported runtimes ([bc81e5d](https://github.com/panva/jose/commit/bc81e5dec2987f6ce6dc3fa5daa23dfe620c0a34))
* typo in JOSENotSupported error when x509 certs are not supported ([bb58c9c](https://github.com/panva/jose/commit/bb58c9ce52e807ca4cfad6bcbf1ab96b91778b1f))



## [1.18.1](https://github.com/panva/jose/compare/v1.18.0...v1.18.1) (2020-01-01)


### Bug Fixes

* force iat past check when maxTokenAge option is used + JWT refactor ([828ad5a](https://github.com/panva/jose/commit/828ad5a33dc0cc0049923b69f43f97463295456e))



## [1.18.0](https://github.com/panva/jose/compare/v1.17.2...v1.18.0) (2019-12-31)


### Features

* add JWT validation profiles for Access Tokens and Logout Tokens ([7bb5c95](https://github.com/panva/jose/commit/7bb5c953a9c6d9bd915e8ebc0608bc0649427745))



## [1.17.2](https://github.com/panva/jose/compare/v1.17.1...v1.17.2) (2019-12-17)


### Bug Fixes

* skip validating iat is in the past when exp is present ([0ed5025](https://github.com/panva/jose/commit/0ed5025de30a754de95ae2587ce0f4573909b006))



## [1.17.1](https://github.com/panva/jose/compare/v1.17.0...v1.17.1) (2019-12-10)


### Bug Fixes

* properly fail to import unsupported openssh keys ([bee5744](https://github.com/panva/jose/commit/bee574457f29597ccab09d51ac61b85dd7a7146a))



## [1.17.0](https://github.com/panva/jose/compare/v1.16.2...v1.17.0) (2019-12-10)


### Features

* importing a certificate populates x5c and x5t thumbprints ([25a7a71](https://github.com/panva/jose/commit/25a7a71915c4f7514536cec9e7e162d0ad3b670c)), closes [#59](https://github.com/panva/jose/issues/59)



## [1.16.2](https://github.com/panva/jose/compare/v1.16.1...v1.16.2) (2019-12-05)


### Bug Fixes

* handle Unencoded Payload (b64:false) with arbitrary buffer payloads ([daabedc](https://github.com/panva/jose/commit/daabedc776617f4fde427b3a5e79d8c176293132)), closes [#57](https://github.com/panva/jose/issues/57)



## [1.16.1](https://github.com/panva/jose/compare/v1.16.0...v1.16.1) (2019-12-05)


### Bug Fixes

* allow PBES2 for the correct JWK `use` values ([f0d7194](https://github.com/panva/jose/commit/f0d719416ec9ca041ea88b8a983b5d899a6aa107))



## [1.16.0](https://github.com/panva/jose/compare/v1.15.1...v1.16.0) (2019-12-04)


### Features

* two official jose plugins/extensions for those living on the edge ([5b27c97](https://github.com/panva/jose/commit/5b27c97ac8836ffa9f3880e009c8db5afbfbaa2c)), closes [#56](https://github.com/panva/jose/issues/56)



## [1.15.1](https://github.com/panva/jose/compare/v1.15.0...v1.15.1) (2019-11-30)


### Bug Fixes

* **typescript:** export Key Input types ([0277fcd](https://github.com/panva/jose/commit/0277fcd1896af497e79190212b0719f7e62366c1))



## [1.15.0](https://github.com/panva/jose/compare/v1.14.0...v1.15.0) (2019-11-27)


### Bug Fixes

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


### Bug Fixes

* only use secp256k1 keys for signing/verification ([9588223](https://github.com/panva/jose/commit/95882232d6d409a321b6a8c168f5b78ebbdabf95))



## [1.10.1](https://github.com/panva/jose/compare/v1.10.0...v1.10.1) (2019-10-04)


### Bug Fixes

* throw proper error when runtime doesn't support OKP ([0a16efb](https://github.com/panva/jose/commit/0a16efb)), closes [#48](https://github.com/panva/jose/issues/48)



## [1.10.0](https://github.com/panva/jose/compare/v1.9.2...v1.10.0) (2019-10-01)


### Features

* rename package ([26f4cf2](https://github.com/panva/jose/commit/26f4cf2))



## [1.9.2](https://github.com/panva/jose/compare/v1.9.1...v1.9.2) (2019-09-16)


### Bug Fixes

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


### Bug Fixes

* properly pad calculated RSA primes ([dd121ce](https://github.com/panva/jose/commit/dd121ce))



## [1.6.0](https://github.com/panva/jose/compare/v1.5.2...v1.6.0) (2019-07-27)


### Bug Fixes

* use the correct ECPrivateKey version when importing EC JWK ([24acd20](https://github.com/panva/jose/commit/24acd20))


### Features

* electron v6.x support ([e7ad82c](https://github.com/panva/jose/commit/e7ad82c))



## [1.5.2](https://github.com/panva/jose/compare/v1.5.1...v1.5.2) (2019-07-27)


### Bug Fixes

* importing x5c in electron requires the input split ([181fd09](https://github.com/panva/jose/commit/181fd09))



## [1.5.1](https://github.com/panva/jose/compare/v1.5.0...v1.5.1) (2019-07-27)


### Bug Fixes

* correctly pad integers when importing RSA JWK ([1dc7f35](https://github.com/panva/jose/commit/1dc7f35))



## [1.5.0](https://github.com/panva/jose/compare/v1.4.1...v1.5.0) (2019-07-23)


### Features

* validate JWTs according to a JWT profile - ID Token ([6c98b61](https://github.com/panva/jose/commit/6c98b61))



## [1.4.1](https://github.com/panva/jose/compare/v1.4.0...v1.4.1) (2019-07-14)


### Bug Fixes

* honour the JWT.sign `jti` option ([36c9ce2](https://github.com/panva/jose/commit/36c9ce2)), closes [#33](https://github.com/panva/jose/issues/33)



## [1.4.0](https://github.com/panva/jose/compare/v1.3.0...v1.4.0) (2019-07-08)


### Features

* add secp256k1 EC Key curve and ES256K ([211d7af](https://github.com/panva/jose/commit/211d7af))



## [1.3.0](https://github.com/panva/jose/compare/v1.0.2...c51dc28) (2019-06-21)


### Features

* compute private RSA key p, q, dp, dq, qi when omitted ([6e3d6fd](https://github.com/panva/jose/commit/6e3d6fd)), closes [#26](https://github.com/panva/jose/issues/26)
* add support for JWK x5c, x5t and x5t#S256 ([9d46c48](https://github.com/panva/jose/commit/9d46c48))
* instances of JWKS.KeyStore are now iterable (e.g. for ... of) ([2eae293](https://github.com/panva/jose/commit/2eae293))

### Bug Fixes

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


### Bug Fixes

* add missing keystore.toJWKS() .d.ts definition ([c7a8606](https://github.com/panva/jose/commit/c7a8606)), closes [#25](https://github.com/panva/jose/issues/25)



## [1.0.1](https://github.com/panva/jose/compare/v1.0.0...v1.0.1) (2019-04-27)


### Bug Fixes

* oct key ts "k" type fix ([0750d2c](https://github.com/panva/jose/commit/0750d2c))



## [1.0.0](https://github.com/panva/jose/compare/v0.12.0...v1.0.0) (2019-04-23)


### Bug Fixes

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


### Bug Fixes

* properly restrict EC curves in generate(Sync) ([764b863](https://github.com/panva/jose/commit/764b863))
* remove unintended exposure of private material via enumerables ([946d9df](https://github.com/panva/jose/commit/946d9df))



## [0.11.3](https://github.com/panva/jose/compare/v0.11.2...v0.11.3) (2019-03-27)


### Bug Fixes

* throw on unsupported EC curves ([cfa4222](https://github.com/panva/jose/commit/cfa4222))


### Features

* add EC P-256K JWK and ES256K sign/verify support ([2e33e1c](https://github.com/panva/jose/commit/2e33e1c))



## [0.11.2](https://github.com/panva/jose/compare/v0.11.1...v0.11.2) (2019-03-19)


### Bug Fixes

* internal symbol method is now really a symbol ([925d47c](https://github.com/panva/jose/commit/925d47c))
* key.toJWK() fixed on windows ([57f1692](https://github.com/panva/jose/commit/57f1692)), closes [#17](https://github.com/panva/jose/issues/17)


## [0.11.1](https://github.com/panva/jose/compare/v0.11.0...v0.11.1) (2019-03-17)


### Bug Fixes

* restrict RS key algorithms by the key's bit size ([9af295b](https://github.com/panva/jose/commit/9af295b))


## [0.11.0](https://github.com/panva/jose/compare/v0.10.0...v0.11.0) (2019-03-16)


### Bug Fixes

* all JWA defined RSA operations require key of 2048 or more ([cc70c5d](https://github.com/panva/jose/commit/cc70c5d))
* use correct salt length for RSASSA-PSS ([e936d54](https://github.com/panva/jose/commit/e936d54))


### BREAKING CHANGES

* all [JWA](https://tools.ietf.org/html/rfc7518) defined
RSA based operations require key size of 2048 bits or more.



## [0.10.0](https://github.com/panva/jose/compare/v0.9.2...v0.10.0) (2019-03-12)


### Bug Fixes

* do not list "dir" under wrap/unwrapKey operations ([17b37d3](https://github.com/panva/jose/commit/17b37d3))


### Features

* keystore .all and .get operation option ([d349ba9](https://github.com/panva/jose/commit/d349ba9))


### BREAKING CHANGES

* "dir" is no longer returned as wrap/unwrapKey key
operation



## [0.9.2](https://github.com/panva/jose/compare/v0.9.1...v0.9.2) (2019-03-05)


### Bug Fixes

* "dir" is only available on keys with correct lengths ([6854860](https://github.com/panva/jose/commit/6854860))
* do not 'in' operator when importing keys as string ([be3f4e4](https://github.com/panva/jose/commit/be3f4e4))



## [0.9.1](https://github.com/panva/jose/compare/v0.9.0...v0.9.1) (2019-03-02)


### Bug Fixes

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

[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwt]: https://tools.ietf.org/html/rfc7519
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
