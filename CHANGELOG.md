# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.1](https://github.com/panva/jose/compare/v1.4.0...v1.4.1) (2019-07-14)


### Bug Fixes

* honour the JWT.sign `jti` option ([36c9ce2](https://github.com/panva/jose/commit/36c9ce2)), closes [#33](https://github.com/panva/jose/issues/33)



# [1.4.0](https://github.com/panva/jose/compare/v1.3.0...v1.4.0) (2019-07-08)


### Features

* add secp256k1 EC Key curve and ES256K ([211d7af](https://github.com/panva/jose/commit/211d7af))



# [1.3.0](https://github.com/panva/jose/compare/v1.0.2...c51dc28) (2019-06-21)


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

It is recommended not to use @panva/jose versions with this feature in
its original on-by-default form - v1.1.0 and v1.2.0



## [1.0.2](https://github.com/panva/jose/compare/v1.0.1...v1.0.2) (2019-05-13)


### Bug Fixes

* add missing keystore.toJWKS() .d.ts definition ([c7a8606](https://github.com/panva/jose/commit/c7a8606)), closes [#25](https://github.com/panva/jose/issues/25)



## [1.0.1](https://github.com/panva/jose/compare/v1.0.0...v1.0.1) (2019-04-27)


### Bug Fixes

* oct key ts "k" type fix ([0750d2c](https://github.com/panva/jose/commit/0750d2c))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/panva/jose/compare/v0.12.0...v1.0.0) (2019-04-23)


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
* node.js minimal version is now v12.0.0 due to its
added EdDSA support (crypto.sign, crypto.verify and eddsa key objects)



<a name="0.12.0"></a>
# [0.12.0](https://github.com/panva/jose/compare/v0.11.5...v0.12.0) (2019-04-07)


### Reverts

* add EC P-256K JWK and ES256K sign/verify support ([e21fea1](https://github.com/panva/jose/commit/e21fea1))


### BREAKING CHANGES

* removing ES256K alg and EC P-256K crv support until the
IETF WG decides on what the final names will be.



<a name="0.11.5"></a>
## [0.11.5](https://github.com/panva/jose/compare/v0.11.4...v0.11.5) (2019-04-04)


### Features

* add key.secret<boolean> and key.type<string> for completeness ([2dd7053](https://github.com/panva/jose/commit/2dd7053))
* add key.thumbprint always returning the JWK Thumbprint (RFC7638) ([65db7e0](https://github.com/panva/jose/commit/65db7e0))



<a name="0.11.4"></a>
## [0.11.4](https://github.com/panva/jose/compare/v0.11.3...v0.11.4) (2019-03-28)


### Bug Fixes

* properly restrict EC curves in generate(Sync) ([764b863](https://github.com/panva/jose/commit/764b863))
* remove unintended exposure of private material via enumerables ([946d9df](https://github.com/panva/jose/commit/946d9df))



<a name="0.11.3"></a>
## [0.11.3](https://github.com/panva/jose/compare/v0.11.2...v0.11.3) (2019-03-27)


### Bug Fixes

* throw on unsupported EC curves ([cfa4222](https://github.com/panva/jose/commit/cfa4222))


### Features

* add EC P-256K JWK and ES256K sign/verify support ([2e33e1c](https://github.com/panva/jose/commit/2e33e1c))



<a name="0.11.2"></a>
## [0.11.2](https://github.com/panva/jose/compare/v0.11.1...v0.11.2) (2019-03-19)


### Bug Fixes

* internal symbol method is now really a symbol ([925d47c](https://github.com/panva/jose/commit/925d47c))
* key.toJWK() fixed on windows ([57f1692](https://github.com/panva/jose/commit/57f1692)), closes [#17](https://github.com/panva/jose/issues/17)


## [0.11.1](https://github.com/panva/jose/compare/v0.11.0...v0.11.1) (2019-03-17)


### Bug Fixes

* restrict RS key algorithms by the key's bit size ([9af295b](https://github.com/panva/jose/commit/9af295b))


# [0.11.0](https://github.com/panva/jose/compare/v0.10.0...v0.11.0) (2019-03-16)


### Bug Fixes

* all JWA defined RSA operations require key of 2048 or more ([cc70c5d](https://github.com/panva/jose/commit/cc70c5d))
* use correct salt length for RSASSA-PSS ([e936d54](https://github.com/panva/jose/commit/e936d54))


### BREAKING CHANGES

* all [JWA](https://tools.ietf.org/html/rfc7518) defined
RSA based operations require key size of 2048 bits or more.



# [0.10.0](https://github.com/panva/jose/compare/v0.9.2...v0.10.0) (2019-03-12)


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
| RSAES OAEP | ✓<sup>*</sup> | RSA-OAEP <sub>(<sup>*</sup>RSA-OAEP-256 is not supported due to its lack of support in Node.JS)</sub> |
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
