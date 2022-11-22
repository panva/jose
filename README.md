# jose

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS for Node.js, Browser, Cloudflare Workers, Deno, Bun, and other Web-interoperable runtimes.

## Implemented specs & features

The following specifications are implemented by `jose`

- JSON Web Signature (JWS) - [RFC7515][spec-jws]
- JSON Web Encryption (JWE) - [RFC7516][spec-jwe]
- JSON Web Key (JWK) - [RFC7517][spec-jwk]
- JSON Web Algorithms (JWA) - [RFC7518][spec-jwa]
- JSON Web Token (JWT) - [RFC7519][spec-jwt]
- JSON Web Key Thumbprint - [RFC7638][spec-thumbprint]
- JSON Web Key Thumbprint URI - [RFC9278][spec-thumbprint-uri]
- JWS Unencoded Payload Option - [RFC7797][spec-b64]
- CFRG Elliptic Curve ECDH and Signatures - [RFC8037][spec-okp]
- secp256k1 EC Key curve support - [JOSE Registrations for WebAuthn Algorithms][spec-secp256k1]

The test suite utilizes examples defined in [RFC7520][spec-cookbook] to confirm its JOSE
implementation is correct.

## [💗 Help the project](https://github.com/sponsors/panva)

## Dependencies: 0

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
import * as jose from 'https://deno.land/x/jose@v4.11.1/index.ts'
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
  - [Calculating JWK Thumbprint](docs/functions/jwk_thumbprint.calculateJwkThumbprint.md#readme)
  - [Calculating JWK Thumbprint URI](docs/functions/jwk_thumbprint.calculateJwkThumbprintUri.md#readme)
  - [Verification using a JWK Embedded in a JWS Header](docs/functions/jwk_embedded.EmbeddedJWK.md#readme)
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

## Supported Runtimes

The supported JavaScript runtimes include ones that support the utilized Web API globals and standard built-in objects or are Node.js

These are _(this is not an exhaustive list)_:
- [Bun](https://github.com/panva/jose/issues/471)
- [Browsers](https://github.com/panva/jose/issues/263)
- [Cloudflare Workers](https://github.com/panva/jose/issues/265)
- [Deno](https://github.com/panva/jose/issues/266)
- [Electron](https://github.com/panva/jose/issues/264)
- [Node.js](https://github.com/panva/jose/issues/262)
- [Vercel's Edge Runtime](https://github.com/panva/jose/issues/301)

## FAQ

#### Supported Versions

| Version | Security Fixes 🔑 | Other Bug Fixes 🐞 | New Features ⭐ |
| ------- | --------- | -------- | -------- |
| [v4.x](https://github.com/panva/jose/tree/v4.x) | ✅ | ✅ | ✅ |
| [v3.x](https://github.com/panva/jose/tree/v3.x), [v2.x](https://github.com/panva/jose/tree/v2.x), [v1.x](https://github.com/panva/jose/tree/v1.x) | ✅ | ❌ | ❌ |

#### Uint8Array?!

- Whenever `Uint8Array` is a valid input, so is [`Buffer`](https://nodejs.org/api/buffer.html#buffer_buffer) since buffers are instances of Uint8Array.
- Whenever `Uint8Array` is returned and you want a `Buffer` instead, use `Buffer.from(uint8array)`.

#### Bundle Size, Package Size, Tree Shaking

Yes the bundle size is on the larger side, that is because each module is actually published 
multiple times so that it can remain truly without dependencies and be universal / isomorphic.

Nevertheless, since each module can be required independently and is fully tree-shakeable, the
install size should not be a cause for concern.

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
[spec-thumbprint-uri]: https://www.rfc-editor.org/rfc/rfc9278
