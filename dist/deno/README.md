# `jose` API Documentation

`jose` is JavaScript module for JSON Object Signing and Encryption, providing support for JSON Web Tokens (JWT), JSON Web Signature (JWS), JSON Web Encryption (JWE), JSON Web Key (JWK), JSON Web Key Set (JWKS), and more. The module is designed to work across various Web-interoperable runtimes including Node.js, browsers, Cloudflare Workers, Deno, Bun, and others.

## Sponsor

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../sponsor/Auth0byOkta_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="../sponsor/Auth0byOkta_light.png">
  <img height="65" align="left" alt="Auth0 by Okta" src="../sponsor/Auth0byOkta_light.png">
</picture>

If you want to quickly add JWT authentication to JavaScript apps, feel free to check out Auth0's JavaScript SDK and free plan. [Create an Auth0 account; it's free!][sponsor-auth0]<br><br>

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

## Available modules

**`example`** Deno import
```js
import * as jose from 'https://deno.land/x/jose@v6.0.7/index.ts'
```

### JSON Web Tokens (JWT)

The `jose` module supports JSON Web Tokens (JWT) and provides functionality for signing and verifying tokens, as well as their JWT Claims Set validation.

- [JWT Claims Set Validation & Signature Verification](https://github.com/panva/jose/blob/v6.0.7/docs/jwt/verify/functions/jwtVerify.md) using the `jwtVerify` function
  - [Using a remote JSON Web Key Set (JWKS)](https://github.com/panva/jose/blob/v6.0.7/docs/jwks/remote/functions/createRemoteJWKSet.md)
  - [Using a local JSON Web Key Set (JWKS)](https://github.com/panva/jose/blob/v6.0.7/docs/jwks/local/functions/createLocalJWKSet.md)
- [Signing](https://github.com/panva/jose/blob/v6.0.7/docs/jwt/sign/classes/SignJWT.md) using the `SignJWT` class
- Utility functions
  - [Decoding Token's Protected Header](https://github.com/panva/jose/blob/v6.0.7/docs/util/decode_protected_header/functions/decodeProtectedHeader.md)
  - [Decoding JWT Claims Set](https://github.com/panva/jose/blob/v6.0.7/docs/util/decode_jwt/functions/decodeJwt.md) prior to its validation

### Encrypted JSON Web Tokens

The `jose` module supports encrypted JSON Web Tokens and provides functionality for encrypting and decrypting tokens, as well as their JWT Claims Set validation.

- [Decryption & JWT Claims Set Validation](https://github.com/panva/jose/blob/v6.0.7/docs/jwt/decrypt/functions/jwtDecrypt.md) using the `jwtDecrypt` function
- [Encryption](https://github.com/panva/jose/blob/v6.0.7/docs/jwt/encrypt/classes/EncryptJWT.md) using the `EncryptJWT` class
- Utility functions
  - [Decoding Token's Protected Header](https://github.com/panva/jose/blob/v6.0.7/docs/util/decode_protected_header/functions/decodeProtectedHeader.md)

### Key Utilities

The `jose` module supports importing, exporting, and generating keys and secrets in various formats, including PEM formats like SPKI, X.509 certificate, and PKCS #8, as well as JSON Web Key (JWK).

- Key Import Functions
  - [JWK Import](https://github.com/panva/jose/blob/v6.0.7/docs/key/import/functions/importJWK.md)
  - [Public Key Import (SPKI)](https://github.com/panva/jose/blob/v6.0.7/docs/key/import/functions/importSPKI.md)
  - [Public Key Import (X.509 Certificate)](https://github.com/panva/jose/blob/v6.0.7/docs/key/import/functions/importX509.md)
  - [Private Key Import (PKCS #8)](https://github.com/panva/jose/blob/v6.0.7/docs/key/import/functions/importPKCS8.md)
- Key and Secret Generation Functions
  - [Asymmetric Key Pair Generation](https://github.com/panva/jose/blob/v6.0.7/docs/key/generate_key_pair/functions/generateKeyPair.md)
  - [Symmetric Secret Generation](https://github.com/panva/jose/blob/v6.0.7/docs/key/generate_secret/functions/generateSecret.md)
- Key Export Functions
  - [JWK Export](https://github.com/panva/jose/blob/v6.0.7/docs/key/export/functions/exportJWK.md)
  - [Private Key Export](https://github.com/panva/jose/blob/v6.0.7/docs/dkey/export/functions/exportPKCS8.md)
  - [Public Key Export](https://github.com/panva/jose/blob/v6.0.7/docs/dkey/export/functions/exportSPKI.md)

### JSON Web Signature (JWS)

The `jose` module supports signing and verification of JWS messages with arbitrary payloads in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Signing - [Compact](https://github.com/panva/jose/blob/v6.0.7/docs/jws/compact/sign/classes/CompactSign.md), [Flattened JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jws/flattened/sign/classes/FlattenedSign.md), [General JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jws/general/sign/classes/GeneralSign.md)
- Verification - [Compact](https://github.com/panva/jose/blob/v6.0.7/docs/jws/compact/verify/functions/compactVerify.md), [Flattened JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jws/flattened/verify/functions/flattenedVerify.md), [General JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jws/general/verify/functions/generalVerify.md)
  - [Using a remote JSON Web Key Set (JWKS)](https://github.com/panva/jose/blob/v6.0.7/docs/jwks/remote/functions/createRemoteJWKSet.md)
  - [Using a local JSON Web Key Set (JWKS)](https://github.com/panva/jose/blob/v6.0.7/docs/jwks/local/functions/createLocalJWKSet.md)
- Utility functions
  - [Decoding Token's Protected Header](https://github.com/panva/jose/blob/v6.0.7/docs/util/decode_protected_header/functions/decodeProtectedHeader.md)

### JSON Web Encryption (JWE)

The `jose` module supports encryption and decryption of JWE messages with arbitrary plaintext in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Encryption - [Compact](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/compact/encrypt/classes/CompactEncrypt.md), [Flattened JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/flattened/encrypt/classes/FlattenedEncrypt.md), [General JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/general/encrypt/classes/GeneralEncrypt.md)
- Decryption - [Compact](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/compact/decrypt/functions/compactDecrypt.md), [Flattened JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/flattened/decrypt/functions/flattenedDecrypt.md), [General JSON](https://github.com/panva/jose/blob/v6.0.7/docs/jwe/general/decrypt/functions/generalDecrypt.md)
- Utility functions
  - [Decoding Token's Protected Header](https://github.com/panva/jose/blob/v6.0.7/docs/util/decode_protected_header/functions/decodeProtectedHeader.md)

### Other

The following are additional features and utilities provided by the `jose` module:

- [Calculating JWK Thumbprint](https://github.com/panva/jose/blob/v6.0.7/docs/jwk/thumbprint/functions/calculateJwkThumbprint.md)
- [Calculating JWK Thumbprint URI](https://github.com/panva/jose/blob/v6.0.7/docs/jwk/thumbprint/functions/calculateJwkThumbprintUri.md)
- [Verification using a JWK Embedded in a JWS Header](https://github.com/panva/jose/blob/v6.0.7/docs/jwk/embedded/functions/EmbeddedJWK.md)
- [Unsecured JWT](https://github.com/panva/jose/blob/v6.0.7/docs/jwt/unsecured/classes/UnsecuredJWT.md)
- [JOSE Errors](https://github.com/panva/jose/blob/v6.0.7/docs/util/errors/README.md)

[sponsor-auth0]: https://a0.to/signup/panva

[^cjs]: CJS style `let jose = require('jose')` is possible in Node.js versions where `process.features.require_module` is `true` or with the `--experimental-require-module` Node.js CLI flag.
