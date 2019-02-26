# @panva/jose

[![build][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

"JSON Web Almost Everything" - JWA, JWS, JWE, JWK, JWKS for Node.js with minimal dependencies

See the [`@panva/jwt`](https://github.com/panva/jwt) (coming soon™) for JWT convenience abstraction.

## Implemented specs & features

The following specifications are implemented by @panva/jose

- [RFC7515 - JSON Web Signature (JWS)][spec-jws]
- [RFC7516 - JSON Web Encryption (JWE)][spec-jwe]
- [RFC7517 - JSON Web Key (JWK)][spec-jwk]
- [RFC7518 - JSON Web Algorithms (JWA)][spec-jwa]
- [RFC7638 - JSON Web Key (JWK) Thumbprint][spec-thumbprint]
- [RFC7797 - JWS Unencoded Payload Option][spec-b64]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

<details>
  <summary><em><strong>Detailed feature matrix</strong></em> (Click to expand)</summary><br>

Legend:
- **✓** Implemented
- **✕** Missing node crypto support / won't implement
- **◯** not planned (yet?) / PR / Use-Case first welcome

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

---

Pending Node.js Support 🤞:
- [RFC8037][spec-cfrg] (EdDSA, OKP kty, etc)
  - `crypto.getCurves().includes('Curve25519')` // => 😢
  - `crypto.getCurves().includes('Curve448')` // => 😢
  - `openssl ecparam -list_curves` // => 😢

Won't implement:
- ✕ JWS embedded key / referenced verification
  - one can decode the header and pass the (`x5c`, `jwk`) to `JWK.importKey` and validate with that
    key, similarly the application can handle fetching and then instantiating the referenced `x5u`
    or `jku` in its own code. This way you opt-in to these behaviours and for `x5c` specifically
    the recipient is responsible for validating the certificate chain is trusted
- ✕ JWS detached content
  - one can remove/attach the payload after/before the respective operation
- ✕ "none" alg support
  - no crypto, no use

Not Planned / PR | Use-Case | Discussion Welcome:
- ◯ automatically adding `kid` reference to JWS / JWE Headers
- ◯ `x5c`, `x5t`, `x5t#S256`, `x5u` etc `JWK.Key` fields

</details>

<br>

Have a question about using @panva/jose? - [ask][ask].  
Found a bug? - [report it][bug].  
Missing a feature? - If it wasn't already discussed before, [ask for it][suggest-feature].  
Found a vulnerability? - Reach out to us via email first, see [security vulnerability disclosure][security-vulnerability].  

## Support

[<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160" align="right">][support-patreon]
If you or your business use @panva/jose, please consider becoming a [Patron][support-patreon] so I can continue maintaining it and adding new features carefree. You may also donate one-time via [PayPal][support-paypal].
[<img src="https://cdn.jsdelivr.net/gh/gregoiresgt/payment-icons@183140a5ff8f39b5a19d59ebeb2c77f03c3a24d3/Assets/Payment/PayPal/Paypal@2x.png" width="100" align="right">][support-paypal]

## Documentation

- [@panva/jose API Documentation][documentation]
  - [JWK (JSON Web Key)][documentation-jwk]
  - [JWKS (JSON Web Key Set)][documentation-jwks]
  - [JWS (JSON Web Signature)][documentation-jws]
  - [JWE (JSON Web Encryption)][documentation-jwe]

## Usage

The minimal Node.js version required is v11.8.0

Installing @panva/jose

```sh
$ npm install @panva/jose
```

Usage
```js
const jose = require('@panva/jose')
const {
  JWE, // JSON Web Encryption (JWE)
  JWK, // JSON Web Key (JWK)
  JWKS, // JSON Web Key Set (JWKS)
  JWS, // JSON Web Signature (JWS)
  errors // errors utilized by @panva/jose
} = jose
```

#### Keys and KeyStores

Prepare your Keys and KeyStores. See the [documentation][documentation-jwk] for more.

```js
const key = jose.JWK.importKey(fs.readFileSync('path/to/key/file'))

const jwk = { kty: 'EC',
  kid: 'dl4M_fcI7XoFCsQ22PYrQBkuxZ2pDcbDimcdFmmXM98',
  crv: 'P-256',
  x: 'v37avifcL-xgh8cy6IFzcINqqmFLc2JF20XUpn4Y2uQ',
  y: 'QTwy27XgP7ZMOdGOSopAHB-FU1JMQn3J9GEWGtUXreQ' }
const anotherKey = jose.JWK.importKey(jwk)

const keystore = new jose.JWK.KeyStore(key, key2)
```

#### Signing

Sign with a private or symmetric key using compact serialization. See the [documentation][documentation-jws] for more.

```js
jose.JWS.sign(
  { sub: 'johndoe' },
  privateKey
)
```

#### Verifying

Verify with a public or symmetric key. See the [documentation][documentation-jws] for more.

```js
jose.JWS.verify(
  'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJqb2huZG9lIn0.T_SYLQV3A5_kFDDVNuoadoURSEtuSOR-dG2CMmrP-ULK9xbIf2vYeiHOkvTrnqGlWEGBGxYtsP1VkXmNsi1uOw',
  publicKey
)
```

#### Encrypting

Encrypt using the recipient's public key or a shared symmetrical secret. See the [documentation][documentation-jwe] for more.

```js
jose.JWE.encrypt(
  'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJqb2huZG9lIn0.T_SYLQV3A5_kFDDVNuoadoURSEtuSOR-dG2CMmrP-ULK9xbIf2vYeiHOkvTrnqGlWEGBGxYtsP1VkXmNsi1uOw',
  publicKey
)
```

#### Verifying

Decrypt using the private key or a shared symmetrical secret. See the [documentation][documentation-jwe] for more.

```js
jose.JWE.decrypt(
  'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiRUNESC1FUyIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6IkVsUGhsN1ljTVZsWkhHM0daSkRoOVJhemNYYlN2VFNheUF6aTBINFFtRUEiLCJ5IjoiM0hDREJTRy12emd6cGtLWmJqMU05UzVuUEJrTDBBdFM4U29ORUxMWE1SayJ9fQ..FhmidRo0twvFA7jcfKFNJw.o112vgiG_qUL1JR5WHpsErcxxgaK_FAa7vCWJ--WulndLpdwdRXHd9k3aL_k8K67xoAThrt10d7dSY2TlPpHdYkw979u0V-C4TNrpzNkv5jpBjU6hHyKpoGZfEsiTD1ivHaFy3ZLCTS69kN_eVKsZGLVf_dkq6Sz6bWE4-ln_fuwukPyMvjTyaTreLjPLBZW.ocKwptCm4Zn437L5hWFnHg',
  privateKey
)
```

## FAQ

#### Semver?

**Yes.** Everything that's either exported in the TypeScript definitions file or [documented][documentation]
is subject to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). The rest is to be
considered private API and is subject to change between any versions.

#### How do I use it outside of Node.js

It is **only built for Node.js** environment - it builds on top of the `crypto` module and requires
the KeyObject API that was added in Node.js v11.6.0.

#### How is it different from [`node-jose`][node-jose]

`node-jose` is built to work in any javascript runtime, to be able to do that it packs a lot of
backfill and javascript implementation code in the form of
[`node-forge`](https://github.com/digitalbazaar/forge), this significantly increases the footprint
of the module with dependencies that either aren't ever used or have native implementation available
in Node.js already, those are often times faster and more reliable.

#### How is it different from [`node-jws`](https://github.com/brianloveswords/node-jws) or [`node-jwa`](https://github.com/brianloveswords/node-jwa)?

- it is providing Key and KeyStore abstractions
- there is JSON Web Encryption support
- there is no asynchronous API since node crypto is ultimately entirely synchronous
- it supports all JWS / JWE Serialization Syntaxes

#### What is the ultimate goal?

- **No dependencies**, the moment JWK formatted keys are supported by node's `crypto` the direct
dependency count will go down from 1 to 0. 🚀
- Just the API one needs, having used other jose modules for 3+ years I only include what's useful

#### Why? Just, why?

I was / (still am) using [`node-jose`][node-jose] for [`openid-client`](https://github.com/panva/node-openid-client)
and [`oidc-provider`](https://github.com/panva/node-oidc-provider) and came to realize its shortcomings
in terms of performance and API (not having well defined errors). When Node.js v12 lands in April
2019 I will be releasing new major versions of both those libraries using @panva/jose.

&plus; this was an amazing opportunity to learn JOSE as a whole

#### Where's the performance coming from?

No endless stream of yielded promises, uses KeyObject instances for crypto operations, once a
KeyObject is instantiated the keys do not need to be "prepped" and validated any more in neither
the Node runtime nor the underlying OpenSSL implementation. In some cases this yields 2x throughput
for the actual crypto operation.

[node-jose]: https://github.com/cisco/node-jose
[documentation]: https://github.com/panva/jose/blob/master/docs/README.md
[documentation-jws]: https://github.com/panva/jose/blob/master/docs/README.md#jws-json-web-signature
[documentation-jwe]: https://github.com/panva/jose/blob/master/docs/README.md#jwe-json-web-encryption
[documentation-jwk]: https://github.com/panva/jose/blob/master/docs/README.md#jwk-json-web-key
[documentation-jwks]: https://github.com/panva/jose/blob/master/docs/README.md#jwks-json-web-key-set
[documentation]: https://github.com/panva/jose/blob/master/docs/README.md
[documentation]: https://github.com/panva/jose/blob/master/docs/README.md
[travis-image]: https://api.travis-ci.com/panva/jose.svg?branch=master
[travis-url]: https://travis-ci.com/panva/jose
[codecov-image]: https://img.shields.io/codecov/c/github/panva/jose/master.svg
[codecov-url]: https://codecov.io/gh/panva/jose
[suggest-feature]: https://github.com/panva/jose/issues/new?labels=enhancement&template=feature-request.md&title=proposal%3A+
[bug]: https://github.com/panva/jose/issues/new?labels=bug&template=bug-report.md&title=bug%3A+
[ask]: https://github.com/panva/jose/issues/new?labels=question&template=question.md&title=question%3A+
[security-vulnerability]: https://github.com/panva/jose/issues/new?template=security-vulnerability.md
[support-patreon]: https://www.patreon.com/panva
[support-paypal]: https://www.paypal.me/panva
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-cfrg]: https://tools.ietf.org/html/rfc8037
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[spec-cookbook]: https://tools.ietf.org/html/rfc7520
