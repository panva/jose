# jose

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS for Node.js with minimal dependencies

<p align="center"><img src="/img/demo.gif?raw=true"/></p>

## Implemented specs & features

The following specifications are implemented by `jose`

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key Thumbprint - [RFC7638][spec-thumbprint]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]
- CFRG Elliptic Curve Signatures (EdDSA) - [RFC8037][spec-okp]
- secp256k1 curve EC Key support - [JOSE Registrations for WebAuthn Algorithms][draft-secp256k1]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

Available JWT validation profiles

- Generic JWT
- ID Token (id_token) - [OpenID Connect Core 1.0][spec-oidc-id_token]

<details>
  <summary><em><strong>Detailed feature matrix</strong></em> (Click to expand)</summary><br>

Legend:
- **✓** Implemented
- **✕** Missing node crypto support / won't implement
- **◯** TBD

| JWK Key Types | Supported ||
| -- | -- | -- |
| RSA | ✓ | RSA |
| Elliptic Curve | ✓ | EC |
| Octet Key Pair | ✓ | OKP |
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
| ECDSA | ✓ | ES256, ES256K, ES384, ES512 |
| Edwards-curve DSA | ✓ | EdDSA |
| HMAC with SHA-2 | ✓ | HS256, HS384, HS512 |

| JWE Key Management Algorithms | Supported ||
| -- | -- | -- |
| AES | ✓ | A128KW, A192KW, A256KW |
| AES GCM | ✓ | A128GCMKW, A192GCMKW, A256GCMKW |
| Direct Key Agreement | ✓ | dir |
| RSAES OAEP | ✓ | RSA-OAEP, RSA-OAEP-256 |
| RSAES-PKCS1-v1_5 | ✓ | RSA1_5 |
| PBES2 | ✓ | PBES2-HS256+A128KW, PBES2-HS384+A192KW, PBES2-HS512+A256KW |
| ECDH-ES | ✓ | ECDH-ES, ECDH-ES+A128KW, ECDH-ES+A192KW, ECDH-ES+A256KW |

| JWE Content Encryption Algorithms | Supported ||
| -- | -- | -- |
| AES GCM | ✓ | A128GCM, A192GCM, A256GCM |
| AES_CBC_HMAC_SHA2 | ✓ |  A128CBC-HS256, A192CBC-HS384, A256CBC-HS512 |

| JWT profile validation | Supported | profile option value |
| -- | -- | -- |
| ID Token - [OpenID Connect Core 1.0][spec-oidc-id_token] | ✓ | `id_token` |
| JWT Access Tokens [JWT Profile for OAuth 2.0 Access Tokens][draft-ietf-oauth-access-token-jwt] | ◯ ||
| Logout Token - [OpenID Connect Back-Channel Logout 1.0][spec-oidc-logout_token] | ◯ ||
| JARM - [JWT Secured Authorization Response Mode for OAuth 2.0][draft-jarm] | ◯ ||

Notes
- RSA-OAEP-256 JWE algorithm is only supported when Node.js >= 12.9.0 runtime is detected
- Importing X.509 certificates and handling `x5c` is only supported when Node.js >= 12.0.0 runtime is detected
- OKP keys are only supported when Node.js >= 12.0.0 runtime is detected
- See [#electron-support](#electron-support) for electron exceptions

---

Pending Node.js Support 🤞:
- ECDH-ES with X25519 and X448 - see [nodejs/node#26626](https://github.com/nodejs/node/pull/26626)

Won't implement:
- ✕ JWS embedded key / referenced verification
  - one can decode the header and pass the (`x5c`, `jwk`) to `JWK.asKey` and validate with that
    key, similarly the application can handle fetching and then instantiating the referenced `x5u`
    or `jku` in its own code. This way you opt-in to these behaviours.
- ✕ JWS detached content
  - one can remove/attach the payload after/before the respective operation
- ✕ "none" alg support
  - no crypto, no use

</details>

<br>

Have a question about using `jose`? - [ask][ask].  
Found a bug? - [report it][bug].  
Missing a feature? - If it wasn't already discussed before, [ask for it][suggest-feature].  
Found a vulnerability? - Reach out to us via email first, see [security vulnerability disclosure][security-vulnerability].  

## Sponsor

[<img width="65" height="65" align="left" src="https://avatars.githubusercontent.com/u/2824157?s=75&v=4" alt="auth0-logo">][sponsor-auth0] If you want to quickly add secure token-based authentication to Node.js projects, feel free to check Auth0’s free plan at [auth0.com/overview][sponsor-auth0].<br><br>

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Documentation

- [jose API Documentation][documentation]
  - [JWK (JSON Web Key)][documentation-jwk]
  - [JWKS (JSON Web Key Set)][documentation-jwks]
  - [JWT (JSON Web Token)][documentation-jwt]
  - [JWS (JSON Web Signature)][documentation-jws]
  - [JWE (JSON Web Encryption)][documentation-jwe]

## Usage

For the best performance Node.js version **>=12.0.0** is recommended, but **^10.13.0** lts/dubnium
is also supported.

Installing `jose`

```console
npm install jose
```

Usage
```js
const jose = require('jose')
const {
  JWE,   // JSON Web Encryption (JWE)
  JWK,   // JSON Web Key (JWK)
  JWKS,  // JSON Web Key Set (JWKS)
  JWS,   // JSON Web Signature (JWS)
  JWT,   // JSON Web Token (JWT)
  errors // errors utilized by jose
} = jose
```

#### Keys and KeyStores

Prepare your Keys and KeyStores. See the [documentation][documentation-jwk] for more.

```js
const key = jose.JWK.asKey(fs.readFileSync('path/to/key/file'))

const jwk = { kty: 'EC',
  kid: 'dl4M_fcI7XoFCsQ22PYrQBkuxZ2pDcbDimcdFmmXM98',
  crv: 'P-256',
  x: 'v37avifcL-xgh8cy6IFzcINqqmFLc2JF20XUpn4Y2uQ',
  y: 'QTwy27XgP7ZMOdGOSopAHB-FU1JMQn3J9GEWGtUXreQ' }
const anotherKey = jose.JWK.asKey(jwk)

const keystore = new jose.JWKS.KeyStore(key, key2)
```

### JWT vs JWS

The JWT module provides IANA registered claim type and format validations on top of JWS as well as
convenience options for verifying UNIX timestamps, setting maximum allowed JWT age, verifying
audiences, and more.

The JWS module on the other hand handles the other JWS Serialization Syntaxes with all their
additional available features and allows signing of any payload, i.e. not just serialized JSON
objects.

#### JWT Signing

Sign with a private or symmetric key with plethora of convenience options. See the
[documentation][documentation-jwt] for more.

```js
jose.JWT.sign(
  { 'urn:example:claim': 'foo' },
  privateKey,
  {
    algorithm: 'PS256',
    audience: 'urn:example:client_id',
    expiresIn: '1 hour',
    header: {
      typ: 'JWT'
    },
    issuer: 'https://op.example.com'
  }
)
```

#### JWT Verifying

Verify with a public or symmetric key with plethora of convenience options. See the
[documentation][documentation-jwt] for more.

```js
jose.JWT.verify(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJQUzI1NiIsImtpZCI6IjRQQXBsVkJIN0toS1ZqN0xob0RFM0VVQnNGc0hvaTRhSmxBZGstM3JuME0ifQ.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6ImZvbyIsImF1ZCI6InVybjpleGFtcGxlOmNsaWVudF9pZCIsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20iLCJpYXQiOjE1NTEyOTI2MjksImV4cCI6MTU1MTI5NjIyOX0.nE5fgRL8gvlStf_wB4mJ0TSXVmhJRnUVQuZ0ts6a1nWnnk0Rv69bEJ12BoMdpyPrGa_W6dxU4HFj89F4pQwW0kqBK2-TZ_n9lq-iqupj46w_lpKOfPC3clVc7ZmqYF81bEA-nX93cSKqVV-qPNPEFenb8XHKszYhBFu_uiRg9rXj2qXVU7PXGJAGTzhVgVxB-3XDB1bQ_6KiDCwzVPftrHxEYLydRCaHzggDg6sAFUhQqhPguKuE2gs6jVUh_gIL2RXeoLoinx6gZ72rfovaOmud-yzNIUN8Tvo0pqBmx0s_lEhTlfrQCzN7hZNmV1eG0GDDE-S_CfZhPePnVJZoRA',
  publicKey,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:client_id',
    algorithms: ['PS256']
  }
)
```

#### ID Token Verifying

ID Token is a JWT, but profiled, there are additional requirements to a JWT to be accepted as an
ID Token and it is pretty easy to omit some, use the `profile` option of `JWT.verify` to make sure
what you're accepting is really an ID Token meant to your Client. This will then perform all
doable validations given the input. See the [documentation][documentation-jwt] for more.

```js
jose.JWT.verify(
  'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InIxTGtiQm8zOTI1UmIyWkZGckt5VTNNVmV4OVQyODE3S3gwdmJpNmlfS2MifQ.eyJzdWIiOiJmb28iLCJub25jZSI6ImE1MWNjZjA4ZjRiYmIwNmU4ODcxNWRkYzRiYmI0MWQ4IiwiYXVkIjoidXJuOmV4YW1wbGU6Y2xpZW50X2lkIiwiZXhwIjoxNTYzODg4ODMwLCJpYXQiOjE1NjM4ODUyMzAsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20ifQ.RKCZczgICF5G9XdNDSwe4dolGauQHptpFKPzahA2wYGG2HKrKhyC8ZzqpeVc8cbntuqFBgABJVv6_9YICRx_dgwPYydTpZfZYjHnxrdWF9QsIPEGs672mrnhqIXUnXoseZ0TF6GOq6P7Qbf6gk1ru7TAbr_ieyJnNWcJhh5iHpz1k3mFz0TyTh7UNXshtQXftPUipqz4OBni5r9UaZXHw8B3QYOnms8__GJ3owOxaqkr1jgRs_EWqMlBNjPaj7ElVaeBWljDKuoK673tH0heSpgzUmUX_W8IDUVqs33uglpZwAQC7cAA5mGEg2odcRpvpP5M-WaP4RE9dl9jzcYmrw',
  keystore,
  {
    profile: 'id_token',
    issuer: 'https://op.example.com',
    audience: 'urn:example:client_id',
    nonce: 'a51ccf08f4bbb06e88715ddc4bbb41d8',
    algorithms: ['PS256']
  }
)
```

Note: Depending on the channel you receive an ID Token from the following claims may be required
and must also be checked: `at_hash`, `c_hash` or `s_hash`. Use e.g. [`oidc-token-hash`][oidc-token-hash]
to validate those hashes after getting the ID Token payload and signature validated by `jose`

#### JWS Signing

Sign with a private or symmetric key using compact serialization. See the
[documentation][documentation-jws] for more.

```js
jose.JWS.sign(
  { sub: 'johndoe' },
  privateKey,
  { kid: privateKey.kid }
)
```

#### JWS Verifying

Verify with a public or symmetric key. See the [documentation][documentation-jws] for more.

```js
jose.JWS.verify(
  'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJqb2huZG9lIn0.T_SYLQV3A5_kFDDVNuoadoURSEtuSOR-dG2CMmrP-ULK9xbIf2vYeiHOkvTrnqGlWEGBGxYtsP1VkXmNsi1uOw',
  publicKey
)
```

#### JWE Encrypting

Encrypt using the recipient's public key or a shared symmetrical secret. See the
[documentation][documentation-jwe] for more.

```js
jose.JWE.encrypt(
  'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJqb2huZG9lIn0.T_SYLQV3A5_kFDDVNuoadoURSEtuSOR-dG2CMmrP-ULK9xbIf2vYeiHOkvTrnqGlWEGBGxYtsP1VkXmNsi1uOw',
  publicKey,
  { kid: publicKey.kid }
)
```

#### JWE Decrypting

Decrypt using the private key or a shared symmetrical secret. See the
[documentation][documentation-jwe] for more.

```js
jose.JWE.decrypt(
  'eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiRUNESC1FUyIsImVwayI6eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwieCI6IkVsUGhsN1ljTVZsWkhHM0daSkRoOVJhemNYYlN2VFNheUF6aTBINFFtRUEiLCJ5IjoiM0hDREJTRy12emd6cGtLWmJqMU05UzVuUEJrTDBBdFM4U29ORUxMWE1SayJ9fQ..FhmidRo0twvFA7jcfKFNJw.o112vgiG_qUL1JR5WHpsErcxxgaK_FAa7vCWJ--WulndLpdwdRXHd9k3aL_k8K67xoAThrt10d7dSY2TlPpHdYkw979u0V-C4TNrpzNkv5jpBjU6hHyKpoGZfEsiTD1ivHaFy3ZLCTS69kN_eVKsZGLVf_dkq6Sz6bWE4-ln_fuwukPyMvjTyaTreLjPLBZW.ocKwptCm4Zn437L5hWFnHg',
  privateKey
)
```

#### secp256k1

Note: the secp256k1 JOSE parameters registration and the RFC is still in a draft state. If the WG
draft changes its mind about the parameter names again the new values will be propagated as a MINOR
library version.

When you require `jose` you can work with `secp256k1` EC keys right away, the EC JWK `crv`
used is as per the specification `secp256k1`.

```js
const jose = require('jose')
let key = jose.JWK.generateSync('EC', 'secp256k1')
key = jose.JWK.asKey(fs.readFileSync('path/to/key/file'))
key.crv === 'secp256k1'
```

For legacy reasons the unregistered EC JWK `crv` value `P-256K` is also supported but you must
require `jose` like so to use it:

```js
const jose = require('jose/P-256K')
let key = jose.JWK.generateSync('EC', 'P-256K')
key = jose.JWK.asKey(fs.readFileSync('path/to/key/file'))
key.crv === 'P-256K'
```

#### Electron Support

Electron >=6.0.0 runtime is supported to the extent of the crypto engine BoringSSL feature parity
with standard Node.js OpenSSL. The following is disabled in Electron runtime because of its lack of
[support](https://github.com/panva/jose/blob/master/test/electron/electron.test.js).

- JWE `A128KW`, `A192KW` and `A256KW` algorithms are not available, this also means that other JWAs
  depending on those are not working, those are `ECDH-ES+A128KW`, `ECDH-ES+A192KW`,
  `ECDH-ES+A256KW`, `PBES2-HS256+A128KW`, `PBES2-HS384+A192KW`, `PBES2-HS512+A256KW`)
- OKP curves `Ed448`, `X25519` and `X448` are not supported
- EC curve `secp256k1` is not supported

## FAQ

#### Semver?

**Yes.** Everything that's either exported in the TypeScript definitions file or
[documented][documentation] is subject to
[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). The rest is to be considered
private API and is subject to change between any versions.

#### How do I use it outside of Node.js

It is **only built for ^10.13.0 || >=12.0.0 Node.js** environment - including `jose` in
transpiled browser-environment targeted projects is not supported and may result in unexpected
results.

#### How is it different from [`jws`](https://github.com/brianloveswords/node-jws), [`jwa`](https://github.com/brianloveswords/node-jwa) or [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)?

- it supports JWK Key Format for all four key types (oct, RSA, EC and OKP)
- it is providing Key and KeyStore abstractions
- there is JSON Web Encryption support
- it supports all JWS / JWE Serialization Syntaxes
- it supports the "crit" member validations to make sure extensions are handled correctly
- it is not only validating the signatures, it is making sure the JWE/JWS is syntactically correct,
  e.g. not having duplicated header parameters between protected/unprotected or per-recipient
  headers

#### How is it different from [`node-jose`][node-jose]

`node-jose` is built to work in any javascript runtime, to be able to do that it packs a lot of
backfill and javascript implementation code in the form of
[`node-forge`](https://github.com/digitalbazaar/forge), this significantly increases the footprint
of the module with dependencies that either aren't ever used or have native implementation available
in Node.js already, those are often times faster and more reliable.

#### What is the ultimate goal?

- **No dependencies**, the moment JWK formatted keys are supported by node's `crypto` the direct
dependency count will go down from 1 to 0. 🚀
- Just the API one needs, having used other jose modules for 3+ years I only include what's useful

#### Why? Just, why?

I was using [`node-jose`][node-jose] for
[`openid-client`](https://github.com/panva/node-openid-client) and
[`oidc-provider`](https://github.com/panva/node-oidc-provider) and came to realize its shortcomings
in terms of performance and API (not having well defined errors).

&plus; this was an amazing opportunity to learn JOSE as a whole

[ask]: https://github.com/panva/jose/issues/new?labels=question&template=question.md&title=question%3A+
[bug]: https://github.com/panva/jose/issues/new?labels=bug&template=bug-report.md&title=bug%3A+
[documentation-jwe]: https://github.com/panva/jose/blob/master/docs/README.md#jwe-json-web-encryption
[documentation-jwk]: https://github.com/panva/jose/blob/master/docs/README.md#jwk-json-web-key
[documentation-jwks]: https://github.com/panva/jose/blob/master/docs/README.md#jwks-json-web-key-set
[documentation-jws]: https://github.com/panva/jose/blob/master/docs/README.md#jws-json-web-signature
[documentation-jwt]: https://github.com/panva/jose/blob/master/docs/README.md#jwt-json-web-token
[documentation]: https://github.com/panva/jose/blob/master/docs/README.md
[node-jose]: https://github.com/cisco/node-jose
[security-vulnerability]: https://github.com/panva/jose/issues/new?template=security-vulnerability.md
[spec-b64]: https://tools.ietf.org/html/rfc7797
[spec-cookbook]: https://tools.ietf.org/html/rfc7520
[spec-jwa]: https://tools.ietf.org/html/rfc7518
[spec-jwe]: https://tools.ietf.org/html/rfc7516
[spec-jwk]: https://tools.ietf.org/html/rfc7517
[spec-jws]: https://tools.ietf.org/html/rfc7515
[spec-jwt]: https://tools.ietf.org/html/rfc7519
[spec-okp]: https://tools.ietf.org/html/rfc8037
[draft-secp256k1]: https://tools.ietf.org/html/draft-ietf-cose-webauthn-algorithms-03
[draft-ietf-oauth-access-token-jwt]: https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt
[draft-jarm]: https://openid.net/specs/openid-financial-api-jarm.html
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[spec-oidc-id_token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
[spec-oidc-logout_token]: https://openid.net/specs/openid-connect-backchannel-1_0.html#LogoutToken
[oidc-token-hash]: https://www.npmjs.com/package/oidc-token-hash
[suggest-feature]: https://github.com/panva/jose/issues/new?labels=enhancement&template=feature-request.md&title=proposal%3A+
[support-sponsor]: https://github.com/sponsors/panva
[sponsor-auth0]: https://auth0.com/overview?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=panva-jose&utm_content=auth
