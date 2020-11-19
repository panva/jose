# jose

> Universal "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK with no dependencies using native crypto runtimes

## Implemented specs & features

The following specifications are implemented by `jose`

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key Thumbprint - [RFC7638][spec-thumbprint]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]
- CFRG Elliptic Curve ECDH and Signatures - [RFC8037][spec-okp]
- secp256k1 EC Key curve support - [JOSE Registrations for WebAuthn Algorithms][spec-secp256k1]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Install

```console
npm install jose@3
```

## Documentation

- JSON Web Tokens (JWT)
  - [Signing](docs/classes/_jwt_sign_.signjwt.md#readme)
  - [Verification & Claims Set Validation](docs/functions/_jwt_verify_.jwtverify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](docs/classes/_jwt_encrypt_.encryptjwt.md#readme)
    - [Decryption & Claims Set Validation](docs/functions/_jwt_decrypt_.jwtdecrypt.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](docs/classes/_jwe_compact_encrypt_.compactencrypt.md#readme), [Flattened](docs/classes/_jwe_flattened_encrypt_.flattenedencrypt.md#readme)
  - Decryption - [Compact](docs/functions/_jwe_compact_decrypt_.compactdecrypt.md#readme), [Flattened](docs/functions/_jwe_flattened_decrypt_.flatteneddecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](docs/classes/_jws_compact_sign_.compactsign.md#readme), [Flattened](docs/classes/_jws_flattened_sign_.flattenedsign.md#readme)
  - Verification - [Compact](docs/functions/_jws_compact_verify_.compactverify.md#readme), [Flattened](docs/functions/_jws_flattened_verify_.flattenedverify.md#readme)
- JSON Web Key (JWK)
  - [Parsing (JWK to KeyLike)](docs/functions/_jwk_parse_.parsejwk.md#readme)
  - [Conversion (KeyLike to JWK)](docs/functions/_jwk_from_key_like_.fromkeylike.md#readme)
  - [Thumbprints](docs/functions/_jwk_thumbprint_.calculatethumbprint.md#readme)
  - [EmbeddedJWK](docs/functions/_jwk_embedded_.embeddedjwk.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a remote JWKSet](docs/functions/_jwks_remote_.createremotejwkset.md#readme)
- Key Pair or Secret Generation
  - [Asymmetric Key Pair Generation](docs/functions/_util_generate_key_pair_.generatekeypair.md#readme)
  - [Symmetric Secret Generation](docs/functions/_util_generate_secret_.generatesecret.md#readme)
- [Unsecured JWT](docs/classes/_jwt_unsecured_.unsecuredjwt.md#readme)
- [JOSE Errors](docs/modules/_util_errors_.md)

## Examples

A continuously growing list of examples is available in the [tracker](https://github.com/panva/jose/issues?q=label%3Aexample+label%3Av3.x).

## JOSE Support Matrix

| JWK Key Types | Supported | `kty` value | |
| -- | -- | -- | -- |
| RSA | ✓ | RSA | |
| Elliptic Curve | ✓ | EC | supported curves: P-256, secp256k1, P-384, P-521 |
| Octet Key Pair | ✓ | OKP | supported subtypes: Ed25519, Ed448, X25519, X448 |
| Octet sequence | ✓ | oct | |

| Serialization | JWS Sign | JWS Verify | JWE Encrypt | JWE Decrypt |
| -- | -- | -- | -- | -- |
| Compact | ✓ | ✓ | ✓ | ✓ |
| General JSON | ✕ | ✕ | ✕ | ✕ |
| Flattened JSON | ✓ | ✓ | ✓ | ✓ |

| JWT Sign | JWT Verify | JWT Encrypt | JWT Decrypt |
| -- | -- | -- | -- |
| ✓ | ✓ | ✓ | ✓ |

| JWS Algorithms | Supported | |
| -- | -- | -- |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| ECDSA | ✓ | ES256, ES256K, ES384, ES512 |
| Edwards-curve DSA | ✓ | EdDSA |
| HMAC with SHA-2 | ✓ | HS256, HS384, HS512 |
| Unsecured JWS | ✓ | none |

| JWE Key Management Algorithms | Supported | |
| -- | -- | -- |
| AES | ✓ | A128KW, A192KW, A256KW |
| AES GCM | ✓ | A128GCMKW, A192GCMKW, A256GCMKW |
| Direct Key Agreement | ✓ | dir |
| RSAES OAEP | ✓ | RSA-OAEP, RSA-OAEP-256, RSA-OAEP-384, RSA-OAEP-512 |
| RSAES-PKCS1-v1_5 | ✓ | RSA1_5 |
| PBES2 | ✓ | PBES2-HS256+A128KW, PBES2-HS384+A192KW, PBES2-HS512+A256KW |
| ECDH-ES | ✓ | ECDH-ES, ECDH-ES+A128KW, ECDH-ES+A192KW, ECDH-ES+A256KW |

| JWE Content Encryption Algorithms | Supported | |
| -- | -- | -- |
| AES GCM | ✓ | A128GCM, A192GCM, A256GCM |
| AES CBC w/ HMAC | ✓ |  A128CBC-HS256, A192CBC-HS384, A256CBC-HS512 |

Legend:
- **✓** Implemented
- **✕** Not Considered

## Runtime Support Matrix

| Platform | supported versions | caveats |
| -- | -- | -- |
| Node.js | LTS ^12.19.0 &vert;&vert; ^14.15.0 | |
| Electron | `process.version` must match<br> the Node.js supported versions. So 12+</sup> | see <sup>[1]</sup> |
| Deno | ✕ | needs [Web Cryptography API integration](https://github.com/denoland/deno/issues/1891) first |
| React Native | ✕ | has no available and usable crypto runtime |
| IE | ✕ | implements old version of the Web Cryptography API specification |
| Browsers | see [caniuse.com][caniuse] | |
| --- | | |
| Edge | 79+ | see <sup>[2], [4]</sup> |
| Firefox | 57+ | see <sup>[2]</sup> |
| Chrome | 63+ | see <sup>[2], [4]</sup> |
| Safari | 11+ | see <sup>[2], [3]</sup> |
| Opera | 50+ | see <sup>[2], [4]</sup> |
| iOS Safari | 12+ | see <sup>[2], [3]</sup> |

<sup>1</sup> Due to its use of BoringSSL the following is not supported in Electron
  - A128KW, A192KW, A256KW, and all composite algorithms utilizing those
  - secp256k1 EC curves
  - Ed448, X25519, and X448 OKP Sub Types  

<sup>2</sup> RSA1_5, OKP JWK Key Type, and secp256k1 EC curve is not supported in [Web Cryptography API][webcrypto].   

<sup>3</sup> P-521 EC curve is not supported in Safari  

<sup>4</sup> 192 bit AES keys are not supported in Chromium  

## FAQ

#### Supported Versions

| Version | Bug Fixes 🐞 | New Features ⭐ |
| ------- | --------- | -------- |
| [3.x.x](https://github.com/panva/jose) | ✅ | ✅ |
| [2.x.x](https://github.com/panva/jose/tree/v2.x) | ✅ until 2022-04-30 | ❌ |

#### What is new in v3.x?

- Revised API
- No dependencies
- Browser support (using [Web Cryptography API][webcrypto])
- Promise-based API
- experimental (non-blocking 🎉) Node.js libuv thread pool based runtime

#### v2.x docs?

[Here.](https://github.com/panva/jose/blob/v2.x/docs/README.md)

#### Semver?

**Yes.** All module's public API is subject to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

#### How is it different from [`jws`](https://github.com/brianloveswords/node-jws), [`jwa`](https://github.com/brianloveswords/node-jwa) or [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)?

- it supports browser runtime
- it supports encrypted JWTs (i.e. in JWE format)
- supports secp256k1, Ed25519, Ed448, X25519, and X448
- it supports JWK Key Format for all four key types (oct, RSA, EC and OKP)
- it is exclusively using native platform Key object representations (CryptoKey and KeyObject)
- there is JSON Web Encryption support
- it supports the flattened JWS / JWE Serialization Syntaxes
- it supports the "crit" member validations to make sure extensions are handled correctly

#### How is it different from [`node-jose`](https://github.com/cisco/node-jose)?

`node-jose` is also built to work in any javascript runtime, to be able to do that it packs a lot of
polyfills and javascript implementation code in the form of
[`node-forge`](https://github.com/digitalbazaar/forge), this significantly increases the footprint
of the modules with dependencies that either aren't ever used or have native implementation available
in the runtime already, those are often times faster and more reliable.

- it has smaller module footprints as it does not bundle unnecessary polyfills
- it does not bundle [`node-forge`](https://github.com/digitalbazaar/forge) fallbacks when crypto runtime is unavailable
- supports secp256k1, Ed25519, Ed448, X25519, and X448

#### Uint8Array?!

- Whenever `Uint8Array` is a valid input, so is [`Buffer`](https://nodejs.org/api/buffer.html#buffer_buffer) since buffers are instances of Uint8Array.
- Whenever `Uint8Array` is returned and you want a `Buffer` instead, use `Buffer.from(uint8array)`.

#### Bundle Size, Package Size, Tree Shaking

Yes the bundle size is on the larger side, that is because each module is actually published 
5 times so that it can remain truly without dependencies and be universal / isomorphic.
The source TS files are also published with inline docs so that your IDE's Intelligent code 
completion works and has the exact same documentation as published.

Nevertheless, since each module can be required independently and is fully tree-shakeable, the
install size should not be a cause for concern.

#### Most types are "any"

Install @types/node as your project's development dependency

```
npm install --save-dev @types/node
```

#### "Cannot find module '...' or its corresponding type declarations."

Install @types/node as your project's development dependency

```
npm install --save-dev @types/node
```

#### "Module '"crypto"' has no exported member '...'"

Update @types/node as your project's development dependency

```
npm uninstall @types/node
npm install --save-dev @types/node
```

#### Why? Just. Why?

I was using [`node-jose`][node-jose] for
[`openid-client`](https://github.com/panva/node-openid-client) and
[`oidc-provider`](https://github.com/panva/node-oidc-provider) and came to realize its shortcomings
in terms of performance and API (not having well defined errors).

&plus; this was an amazing opportunity to learn JOSE as a whole

[documentation]: /docs/README.md
[node-jose]: https://github.com/cisco/node-jose
[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-cookbook]: https://tools.ietf.org/html/rfc7520
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwt]: https://tools.ietf.org/html/rfc7519
[spec-okp]: https://tools.ietf.org/html/rfc8037
[spec-secp256k1]: https://tools.ietf.org/html/rfc8812
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[support-sponsor]: https://github.com/sponsors/panva
[conditional-exports]: https://nodejs.org/api/packages.html#packages_conditional_exports
[webcrypto]: https://www.w3.org/TR/WebCryptoAPI/
[nodewebcrypto]: https://nodejs.org/docs/latest-v15.x/api/webcrypto.html
[caniuse]: https://caniuse.com/mdn-javascript_operators_await,async-functions,mdn-javascript_statements_for_await_of,cryptography,textencoder
