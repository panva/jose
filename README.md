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
- CFRG Elliptic Curve ECDH and Signatures - [RFC8037][spec-okp]
- secp256k1 EC Key curve support - [JOSE Registrations for WebAuthn Algorithms][draft-secp256k1]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

Available JWT validation profiles

- Generic JWT
- OIDC ID Token (`id_token`) - [OpenID Connect Core 1.0][spec-oidc-id_token]
- (draft 04) OIDC Logout Token (`logout_token`) - [OpenID Connect Back-Channel Logout 1.0][spec-oidc-logout_token]
- (draft 06) OAuth 2.0 JWT Access Tokens (`at+JWT`) - [JWT Profile for OAuth 2.0 Access Tokens][draft-ietf-oauth-access-token-jwt]

Draft profiles are updated as minor versions of the library, therefore, since they may have breaking
changes use the `~` semver operator when using these and pay close attention to changelog and the
drafts themselves.

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

const keystore = new jose.JWKS.KeyStore(key, anotherKey)
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

<details>
  <summary><em><strong>Verifying OIDC ID Tokens</strong></em> (Click to expand)</summary><br>

ID Token is a JWT, but profiled, there are additional requirements to a JWT to be accepted as an
ID Token and it is pretty easy to omit some, use the `profile` option of `JWT.verify` or the
`JWT.IdToken.verify` shorthand to make sure what you're accepting is really an ID Token meant to
your Client. This will then perform all doable validations given the input. See the
[documentation][documentation-jwt] for more.

```js
jose.JWT.IdToken.verify(
  'eyJhbGciOiJQUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InIxTGtiQm8zOTI1UmIyWkZGckt5VTNNVmV4OVQyODE3S3gwdmJpNmlfS2MifQ.eyJzdWIiOiJmb28iLCJub25jZSI6ImE1MWNjZjA4ZjRiYmIwNmU4ODcxNWRkYzRiYmI0MWQ4IiwiYXVkIjoidXJuOmV4YW1wbGU6Y2xpZW50X2lkIiwiZXhwIjoxNTYzODg4ODMwLCJpYXQiOjE1NjM4ODUyMzAsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20ifQ.RKCZczgICF5G9XdNDSwe4dolGauQHptpFKPzahA2wYGG2HKrKhyC8ZzqpeVc8cbntuqFBgABJVv6_9YICRx_dgwPYydTpZfZYjHnxrdWF9QsIPEGs672mrnhqIXUnXoseZ0TF6GOq6P7Qbf6gk1ru7TAbr_ieyJnNWcJhh5iHpz1k3mFz0TyTh7UNXshtQXftPUipqz4OBni5r9UaZXHw8B3QYOnms8__GJ3owOxaqkr1jgRs_EWqMlBNjPaj7ElVaeBWljDKuoK673tH0heSpgzUmUX_W8IDUVqs33uglpZwAQC7cAA5mGEg2odcRpvpP5M-WaP4RE9dl9jzcYmrw',
  keyOrStore,
  {
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

</details>

<details>
  <summary><em><strong>Verifying OAuth 2.0 JWT Access Tokens</strong></em> (Click to expand)</summary><br>

Draft specification profiles are updated as minor versions of the library, therefore,
since they may have breaking changes use the `~` semver operator when using these and pay close
attention to changelog and the drafts themselves.

When accepting a JWT-formatted OAuth 2.0 Access Token there are additional requirements for the JWT
to be accepted as an Access Token according to the [specification][draft-ietf-oauth-access-token-jwt]
and it is pretty easy to omit some. Use the `profile` option of `JWT.verify` or the
`JWT.AccessToken.verify` shorthand to make sure what you're accepting is really a JWT Access Token
meant for your Resource Server. This will then perform all doable validations given the input. See
the [documentation][documentation-jwt] for more.

```js
jose.JWT.AccessToken.verify(
  'eyJhbGciOiJQUzI1NiIsInR5cCI6ImF0K0pXVCIsImtpZCI6InIxTGtiQm8zOTI1UmIyWkZGckt5VTNNVmV4OVQyODE3S3gwdmJpNmlfS2MifQ.eyJzdWIiOiJmb28iLCJjbGllbnRfaWQiOiJ1cm46ZXhhbXBsZTpjbGllbnRfaWQiLCJhdWQiOiJ1cm46ZXhhbXBsZTpyZXNvdXJjZS1zZXJ2ZXIiLCJleHAiOjE1NjM4ODg4MzAsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20iLCJzY29wZSI6ImFwaTpyZWFkIn0.UYy8vEGWS0cS24giCYobMMy9-bqI45p807yV1l-2WXX2J4UO-eohV_R58LE2oM88gl414c6XydO6QSYXul5roNPoOs41jpEvreQIP-HmegjbWGutktWJKfvoOblE5FjYwjrwStjLQGUzkq6KWcnDLPGmpFy7n6gZ4LF8YVz4dLEaO335hMNVNrmSPSXYqr7bAWybnLVpLxjDYwNfCO1g0_TlFx8fHh2OftHoOOmJFltFwb8JypkSB-JXVVSEh43IOEjeeMJIG_ylWIOxfLLi5Q7vPWgub83ZTkuGNe4KmlQJKIsH5k0yZSshsLYUOOH0RiXqQ-SA4Ubh3Fowigdu-g',
  keyOrStore,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:resource-server',
    algorithms: ['PS256']
  }
)
```

</details>

<details>
  <summary><em><strong>Verifying OIDC Logout Token</strong></em> (Click to expand)</summary><br>

Draft specification profiles are updated as minor versions of the library, therefore,
since they may have breaking changes use the `~` semver operator when using these and pay close
attention to changelog and the drafts themselves.

Logout Token is a JWT, but profiled, there are additional requirements to a JWT to be accepted as an
Logout Token and it is pretty easy to omit some, use the `profile` option of `JWT.verify` or the
`JWT.LogoutToken.verify` to make sure what you're accepting is really an Logout Token meant to your
Client. This will then perform all doable validations given the input. See the
[documentation][documentation-jwt] for more.

```js
jose.JWT.LogoutToken.verify(
  'eyJhbGciOiJQUzI1NiJ9.eyJzdWIiOiJmb28iLCJhdWQiOiJ1cm46ZXhhbXBsZTpjbGllbnRfaWQiLCJpYXQiOjE1NjM4ODg4MzAsImp0aSI6ImhqazMyN2RzYSIsImlzcyI6Imh0dHBzOi8vb3AuZXhhbXBsZS5jb20iLCJldmVudHMiOnsiaHR0cDovL3NjaGVtYXMub3BlbmlkLm5ldC9ldmVudC9iYWNrY2hhbm5lbC1sb2dvdXQiOnt9fX0.SBi7uNUvjHL9TFoFzautGgTQ1MjyeGUNYHL7inpgq3XgTv6xc9EAKuPRtpixmhdNhmInGwUvAeqDSJxomwv1KK1cTndrC9zAMZ7h657BGQAwGhu7nTm41fWMpKQdiLa9sqp3yit5_FNBmqUNeOoMPrYT_Vl9ytsoNO89MUQy2aqCd-Z7BrNJZH0QycdW6dmYlrmZL7w3t3TaAXoJDJ4Hgl2Itkkkb6_6gO-VoPIdVD8sDuf1zQzGhIkmcFrk0fXczVYOkeF2hNYBuvsM8LuO-EPA3oyE2In9djai3M7yceTQetRa1vwlqWkg_xmYS59ry-6wT44aN7-Y6p0TdXm-Zg',
  keyOrStore,
  {
    issuer: 'https://op.example.com',
    audience: 'urn:example:client_id',
    algorithms: ['PS256']
  }
)
```

</details>

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

## Detailed Support Matrix

| JWK Key Types | Supported | `kty` value | `crv` values |
| -- | -- | -- | -- |
| RSA | ✓ | RSA ||
| Elliptic Curve | ✓ | EC | P-256, secp256k1<sup>[1]</sup>, P-384, P-521 |
| Octet Key Pair | ✓ | OKP | Ed25519, Ed448<sup>[1]</sup>, X25519<sup>[1]</sup>, X448<sup>[1]</sup> |
| Octet sequence | ✓ | oct ||

| Serialization | JWS Sign | JWS Verify | JWE Encrypt | JWE Decrypt |
| -- | -- | -- | -- | -- |
| Compact | ✓ | ✓ | ✓ | ✓ |
| General JSON | ✓ | ✓ | ✓ | ✓ |
| Flattened JSON  | ✓ | ✓ | ✓ | ✓ |

| JWS Algorithms | Supported ||
| -- | -- | -- |
| RSASSA-PKCS1-v1_5 | ✓ | RS256, RS384, RS512 |
| RSASSA-PSS | ✓ | PS256, PS384, PS512 |
| ECDSA | ✓ | ES256, ES256K<sup>[1]</sup>, ES384, ES512 |
| Edwards-curve DSA | ✓ | EdDSA |
| HMAC with SHA-2 | ✓ | HS256, HS384, HS512 |
| Unsecured JWS | ✓ | none<sup>[2]</sup> |

| JWE Key Management Algorithms | Supported ||
| -- | -- | -- |
| AES | ✓ | A128KW<sup>[1]</sup>, A192KW<sup>[1]</sup>, A256KW<sup>[1]</sup> |
| AES GCM | ✓ | A128GCMKW, A192GCMKW, A256GCMKW |
| Direct Key Agreement | ✓ | dir |
| RSAES OAEP | ✓ | RSA-OAEP, RSA-OAEP-256<sup>[3]</sup>, RSA-OAEP-384<sup>[3]</sup>, RSA-OAEP-512<sup>[3]</sup> |
| RSAES-PKCS1-v1_5 | ✓ | RSA1_5 |
| PBES2 | ✓ | PBES2-HS256+A128KW<sup>[1]</sup>, PBES2-HS384+A192KW<sup>[1]</sup>, PBES2-HS512+A256KW<sup>[1]</sup> |
| ECDH-ES | ✓<sup>[4]</sup> | ECDH-ES, ECDH-ES+A128KW<sup>[1]</sup>, ECDH-ES+A192KW<sup>[1]</sup>, ECDH-ES+A256KW<sup>[1]</sup> |

| JWE Content Encryption Algorithms | Supported ||
| -- | -- | -- |
| AES GCM | ✓ | A128GCM, A192GCM, A256GCM |
| AES_CBC_HMAC_SHA2 | ✓ |  A128CBC-HS256, A192CBC-HS384, A256CBC-HS512 |

| JWT profile validation | Supported | Stable profile | profile option value |
| -- | -- | -- | -- |
| ID Token - [OpenID Connect Core 1.0][spec-oidc-id_token] | ✓ | ✓ | `id_token` |
| JWT Access Tokens - [JWT Profile for OAuth 2.0 Access Tokens][draft-ietf-oauth-access-token-jwt] | ✓ | ✕<sup>5</sup> | `at+JWT` |
| Logout Token - [OpenID Connect Back-Channel Logout 1.0][spec-oidc-logout_token] | ✓ | ✕<sup>5</sup> | `logout_token` |
| JARM - [JWT Secured Authorization Response Mode for OAuth 2.0][draft-jarm] | ◯ |||
| [JWT Response for OAuth Token Introspection][draft-jwtintrospection] | ◯ |||

Legend:
- **✓** Implemented
- **✕** Missing node crypto support / won't implement
- **◯** TBD

<sup>1</sup> Not supported in Electron due to Electron's use of BoringSSL  
<sup>2</sup> Unsecured JWS is [supported][documentation-none] for the JWS and JWT sign and verify
operations but it is an entirely opt-in behaviour, downgrade attacks are prevented by the required
use of a special `JWK.Key`-like object that cannot be instantiated through the key import API  
<sup>3</sup> RSAES OAEP using SHA-2 and MGF1 with SHA-2 is only supported when Node.js `>=12.9.0` runtime is detected  
<sup>4</sup> ECDH-ES with X25519 and X448 keys is only supported when Node.js `^12.17.0 || >=13.9.0` runtime is detected  
<sup>5</sup> Draft specification profiles are updated as minor versions of the library, therefore,
since they may have breaking changes use the `~` semver operator when using these and pay close
attention to changelog and the drafts themselves.

## FAQ

#### Semver?

**Yes.** Everything that's either exported in the TypeScript definitions file or
[documented][documentation] is subject to
[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). The rest is to be considered
private API and is subject to change between any versions.

**Although.** Draft specification profiles are updated as minor versions of the library, therefore,
since they may have breaking changes use the `~` semver operator when using these and pay close
attention to changelog and the drafts themselves.

#### How do I use it outside of Node.js

It is **only built for >=10.13.0 Node.js** environment - including `jose` in transpiled
browser-environment targeted projects is not supported and may result in unexpected results.

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

[documentation-jwe]: /docs/README.md#jwe-json-web-encryption
[documentation-jwk]: /docs/README.md#jwk-json-web-key
[documentation-jwks]: /docs/README.md#jwks-json-web-key-set
[documentation-jws]: /docs/README.md#jws-json-web-signature
[documentation-jwt]: /docs/README.md#jwt-json-web-token
[documentation-none]: /docs/README.md#jwknone
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
[draft-secp256k1]: https://tools.ietf.org/html/draft-ietf-cose-webauthn-algorithms-04
[draft-ietf-oauth-access-token-jwt]: https://tools.ietf.org/html/draft-ietf-oauth-access-token-jwt-06
[draft-jarm]: https://openid.net/specs/openid-financial-api-jarm.html
[draft-jwtintrospection]: https://tools.ietf.org/html/draft-ietf-oauth-jwt-introspection-response
[spec-thumbprint]: https://tools.ietf.org/html/rfc7638
[spec-oidc-id_token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
[spec-oidc-logout_token]: https://openid.net/specs/openid-connect-backchannel-1_0-04.html#LogoutToken
[oidc-token-hash]: https://www.npmjs.com/package/oidc-token-hash
[support-sponsor]: https://github.com/sponsors/panva
[sponsor-auth0]: https://auth0.com/overview?utm_source=GHsponsor&utm_medium=GHsponsor&utm_campaign=panva-jose&utm_content=auth
