# jose

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS with no dependencies using runtime's native crypto in Node.js, Browser, Cloudflare Workers, Electron, and Deno.

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

## Documentation

**`example`** ESM import
```js
import * as jose from 'jose'
```

**`example`** CJS require
```js
const jose = require('jose')
```

**`example`** Deno import
```js
import * as jose from 'https://deno.land/x/jose/index.ts'
```

- JSON Web Tokens (JWT)
  - [Signing](docs/classes/jwt_sign.SignJWT.md#readme)
  - [Verification & JWT Claims Set Validation](docs/functions/jwt_verify.jwtVerify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](docs/classes/jwt_encrypt.EncryptJWT.md#readme)
    - [Decryption & JWT Claims Set Validation](docs/functions/jwt_decrypt.jwtDecrypt.md#readme)
- Key Import
  - [JWK Import](docs/functions/key_import.importJWK.md#readme)
  - [Public Key Import (SPKI)](docs/functions/key_import.importSPKI.md#readme)
  - [Public Key Import (X.509 Certificate)](docs/functions/key_import.importX509.md#readme)
  - [Private Key Import (PKCS #8)](docs/functions/key_import.importPKCS8.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme), [Flattened](docs/classes/jwe_flattened_encrypt.FlattenedEncrypt.md#readme), [General](docs/classes/jwe_general_encrypt.GeneralEncrypt.md#readme)
  - Decryption - [Compact](docs/functions/jwe_compact_decrypt.compactDecrypt.md#readme), [Flattened](docs/functions/jwe_flattened_decrypt.flattenedDecrypt.md#readme), [General](docs/functions/jwe_general_decrypt.generalDecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](docs/classes/jws_compact_sign.CompactSign.md#readme), [Flattened](docs/classes/jws_flattened_sign.FlattenedSign.md#readme), [General](docs/classes/jws_general_sign.GeneralSign.md#readme)
  - Verification - [Compact](docs/functions/jws_compact_verify.compactVerify.md#readme), [Flattened](docs/functions/jws_flattened_verify.flattenedVerify.md#readme), [General](docs/functions/jws_general_verify.generalVerify.md#readme)
- JSON Web Key (JWK)
  - [Thumbprints](docs/functions/jwk_thumbprint.calculateJwkThumbprint.md#readme)
  - [EmbeddedJWK](docs/functions/jwk_embedded.EmbeddedJWK.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a local JWKSet](docs/functions/jwks_local.createLocalJWKSet.md#readme)
  - [Verify using a remote JWKSet](docs/functions/jwks_remote.createRemoteJWKSet.md#readme)
- Key Pair or Secret Generation
  - [Asymmetric Key Pair Generation](docs/functions/key_generate_key_pair.generateKeyPair.md#readme)
  - [Symmetric Secret Generation](docs/functions/key_generate_secret.generateSecret.md#readme)
- Key Export
  - [JWK Export](docs/functions/key_export.exportJWK.md#readme)
  - [Private Key Export](docs/functions/key_export.exportPKCS8.md#readme)
  - [Public Key Export](docs/functions/key_export.exportSPKI.md#readme)
- Utilities
  - [Decoding Token's Protected Header](docs/functions/util_decode_protected_header.decodeProtectedHeader.md#readme)
  - [Decoding JWT Claims Set](docs/functions/util_decode_jwt.decodeJwt.md#readme)
- [Unsecured JWT](docs/classes/jwt_unsecured.UnsecuredJWT.md#readme)
- [JOSE Errors](docs/modules/util_errors.md#readme)

## Supported Runtimes, Environments, Platforms

- [Browser Support][]
- [Cloudflare Workers Support][]
- [Deno Support][]
- [Electron Support][]
- [Next.js Middleware / Vercel Edge Functions Support][]
- [Node.js Support][]

## FAQ

#### Supported Versions

| Version | Security Fixes 🔑 | Other Bug Fixes 🐞 | New Features ⭐ |
| ------- | --------- | -------- | -------- |
| [4.x.x](https://github.com/panva/jose/tree/v4.x) | ✅ | ✅ | ✅ |
| [3.x.x](https://github.com/panva/jose/tree/v3.x) | ✅ | ✅ until 2022-04-30 | ❌ |
| [2.x.x](https://github.com/panva/jose/tree/v2.x) | ✅ | ✅ until 2022-04-30 | ❌ |
| [1.x.x](https://github.com/panva/jose/tree/v1.x) | ✅ | ❌ | ❌ |

#### Semver?

**Yes.** All module's public API is subject to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

#### How is it different from [`jws`](https://github.com/brianloveswords/node-jws), [`jwa`](https://github.com/brianloveswords/node-jwa) or [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)?

- it supports Browser, Cloudflare Workers, and Deno runtimes
- it supports encrypted JWTs (i.e. in JWE format)
- supports secp256k1, Ed25519, Ed448, X25519, and X448
- it supports JWK Key Format for all four key types (oct, RSA, EC and OKP)
- it is exclusively using native platform Key object representations (CryptoKey and KeyObject)
- there is JSON Web Encryption support
- it supports the flattened JWS / JWE Serialization Syntaxes
- it supports the "crit" member validations to make sure extensions are handled correctly

#### How is it different from [`node-jose`](https://github.com/cisco/node-jose)?

`node-jose` is built to work in any javascript runtime, to be able to do that it packs a lot of
polyfills and javascript implementation code in the form of
[`node-forge`](https://github.com/digitalbazaar/forge), this significantly increases the footprint
of the modules with dependencies that either aren't ever used or have native implementation available
in the runtime already, those are often times faster and more reliable.

- supports secp256k1, Ed25519, Ed448, X25519, and X448

#### Uint8Array?!

- Whenever `Uint8Array` is a valid input, so is [`Buffer`](https://nodejs.org/api/buffer.html#buffer_buffer) since buffers are instances of Uint8Array.
- Whenever `Uint8Array` is returned and you want a `Buffer` instead, use `Buffer.from(uint8array)`.

#### Bundle Size, Package Size, Tree Shaking

Yes the bundle size is on the larger side, that is because each module is actually published 
multiple times so that it can remain truly without dependencies and be universal / isomorphic.

Nevertheless, since each module can be required independently and is fully tree-shakeable, the
install size should not be a cause for concern.

[documentation]: /docs/README.md
[node-jose]: https://github.com/cisco/node-jose
[spec-b64]: https://www.rfc-editor.org/rfc/rfc7797
[spec-cookbook]: https://www.rfc-editor.org/rfc/rfc7520
[spec-jwa]: https://www.rfc-editor.org/rfc/rfc7518
[spec-jwe]: https://www.rfc-editor.org/rfc/rfc7516
[spec-jwk]: https://www.rfc-editor.org/rfc/rfc7517
[spec-jws]: https://www.rfc-editor.org/rfc/rfc7515
[spec-jwt]: https://www.rfc-editor.org/rfc/rfc7519
[spec-okp]: https://www.rfc-editor.org/rfc/rfc8037
[spec-secp256k1]: https://www.rfc-editor.org/rfc/rfc8812
[spec-thumbprint]: https://www.rfc-editor.org/rfc/rfc7638
[support-sponsor]: https://github.com/sponsors/panva
[conditional-exports]: https://nodejs.org/api/packages.html#packages_conditional_exports
[webcrypto]: https://www.w3.org/TR/WebCryptoAPI/
[nodewebcrypto]: https://nodejs.org/docs/latest-v15.x/api/webcrypto.html
[deno.land/x/jose]: https://deno.land/x/jose

[Browser Support]: https://github.com/panva/jose/issues/263
[Cloudflare Workers Support]: https://github.com/panva/jose/issues/265
[Deno Support]: https://github.com/panva/jose/issues/266
[Electron Support]: https://github.com/panva/jose/issues/264
[Next.js Middleware / Vercel Edge Functions Support]: https://github.com/panva/jose/issues/301
[Node.js Support]: https://github.com/panva/jose/issues/262
