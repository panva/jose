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

`jose` is distributed via [npmjs.com](https://www.npmjs.com/package/jose), [deno.land/x](https://deno.land/x/jose), [cdnjs.com](https://cdnjs.com/libraries/jose), [jsdelivr.com](https://www.jsdelivr.com/package/npm/jose), [github.com](https://github.com/panva/jose).

**`example`** ESM import
```js
import * as jose from 'jose'
```

**`example`** CJS require
```js
const jose = require('jose')
```

### JSON Web Tokens (JWT)

The `jose` module supports JSON Web Tokens (JWT) and provides functionality for signing and verifying tokens, as well as their JWT Claims Set validation.

- [JWT Claims Set Validation & Signature Verification](jwt/verify/functions/jwtVerify.md) using the `jwtVerify` function
  - [Using a remote JSON Web Key Set (JWKS)](jwks/remote/functions/createRemoteJWKSet.md)
  - [Using a local JSON Web Key Set (JWKS)](jwks/local/functions/createLocalJWKSet.md)
- [Signing](jwt/sign/classes/SignJWT.md) using the `SignJWT` class
- Utility functions
  - [Decoding Token's Protected Header](util/decode_protected_header/functions/decodeProtectedHeader.md)
  - [Decoding JWT Claims Set](util/decode_jwt/functions/decodeJwt.md) prior to its validation

### Encrypted JSON Web Tokens

The `jose` module supports encrypted JSON Web Tokens and provides functionality for encrypting and decrypting tokens, as well as their JWT Claims Set validation.

- [Decryption & JWT Claims Set Validation](jwt/decrypt/functions/jwtDecrypt.md) using the `jwtDecrypt` function
- [Encryption](jwt/encrypt/classes/EncryptJWT.md) using the `EncryptJWT` class
- Utility functions
  - [Decoding Token's Protected Header](util/decode_protected_header/functions/decodeProtectedHeader.md)

### Key Utilities

The `jose` module supports importing, exporting, and generating keys and secrets in various formats, including PEM formats like SPKI, X.509 certificate, and PKCS #8, as well as JSON Web Key (JWK).

- Key Import Functions
  - [JWK Import](key/import/functions/importJWK.md)
  - [Public Key Import (SPKI)](key/import/functions/importSPKI.md)
  - [Public Key Import (X.509 Certificate)](key/import/functions/importX509.md)
  - [Private Key Import (PKCS #8)](key/import/functions/importPKCS8.md)
- Key and Secret Generation Functions
  - [Asymmetric Key Pair Generation](key/generate_key_pair/functions/generateKeyPair.md)
  - [Symmetric Secret Generation](key/generate_secret/functions/generateSecret.md)
- Key Export Functions
  - [JWK Export](key/export/functions/exportJWK.md)
  - [Private Key Export](dkey/export/functions/exportPKCS8.md)
  - [Public Key Export](dkey/export/functions/exportSPKI.md)

### JSON Web Signature (JWS)

The `jose` module supports signing and verification of JWS messages with arbitrary payloads in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Signing - [Compact](jws/compact/sign/classes/CompactSign.md), [Flattened JSON](jws/flattened/sign/classes/FlattenedSign.md), [General JSON](jws/general/sign/classes/GeneralSign.md)
- Verification - [Compact](jws/compact/verify/functions/compactVerify.md), [Flattened JSON](jws/flattened/verify/functions/flattenedVerify.md), [General JSON](jws/general/verify/functions/generalVerify.md)
  - [Using a remote JSON Web Key Set (JWKS)](jwks/remote/functions/createRemoteJWKSet.md)
  - [Using a local JSON Web Key Set (JWKS)](jwks/local/functions/createLocalJWKSet.md)
- Utility functions
  - [Decoding Token's Protected Header](util/decode_protected_header/functions/decodeProtectedHeader.md)

### JSON Web Encryption (JWE)

The `jose` module supports encryption and decryption of JWE messages with arbitrary plaintext in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Encryption - [Compact](jwe/compact/encrypt/classes/CompactEncrypt.md), [Flattened JSON](jwe/flattened/encrypt/classes/FlattenedEncrypt.md), [General JSON](jwe/general/encrypt/classes/GeneralEncrypt.md)
- Decryption - [Compact](jwe/compact/decrypt/functions/compactDecrypt.md), [Flattened JSON](jwe/flattened/decrypt/functions/flattenedDecrypt.md), [General JSON](jwe/general/decrypt/functions/generalDecrypt.md)
- Utility functions
  - [Decoding Token's Protected Header](util/decode_protected_header/functions/decodeProtectedHeader.md)

### Other

The following are additional features and utilities provided by the `jose` module:

<<<<<<< HEAD
- [Calculating JWK Thumbprint](functions/jwk_thumbprint.calculateJwkThumbprint.md)
- [Calculating JWK Thumbprint URI](functions/jwk_thumbprint.calculateJwkThumbprintUri.md)
- [Verification using a JWK Embedded in a JWS Header](functions/jwk_embedded.EmbeddedJWK.md)
- [Unsecured JWT](classes/jwt_unsecured.UnsecuredJWT.md)
- [JOSE Errors](modules/util_errors.md)

[sponsor-auth0]: https://auth0.com/signup?utm_source=external_sites&utm_medium=panva&utm_campaign=devn_signup
=======
- [Calculating JWK Thumbprint](jwk/thumbprint/functions/calculateJwkThumbprint.md)
- [Calculating JWK Thumbprint URI](jwk/thumbprint/functions/calculateJwkThumbprintUri.md)
- [Verification using a JWK Embedded in a JWS Header](jwk/embedded/functions/EmbeddedJWK.md)
- [Unsecured JWT](jwt/unsecured/classes/UnsecuredJWT.md)
- [JOSE Errors](util/errors/README.md)
>>>>>>> d7ce2211 (wip)
