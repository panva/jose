# `jose` API Documentation

`jose` is JavaScript module for JSON Object Signing and Encryption, providing support for JSON Web Tokens (JWT), JSON Web Signature (JWS), JSON Web Encryption (JWE), JSON Web Key (JWK), JSON Web Key Set (JWKS), and more. The module is designed to work across various Web-interoperable runtimes including Node.js, browsers, Cloudflare Workers, Deno, Bun, and others.

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

- [JWT Claims Set Validation & Signature Verification](functions/jwt_verify.jwtVerify.md) using the `jwtVerify` function
  - [Using a remote JWKS](functions/jwks_remote.createRemoteJWKSet.md)
  - [Using a local JWKS](functions/jwks_local.createLocalJWKSet.md)
- [Signing](classes/jwt_sign.SignJWT.md) using the `SignJWT` class
- Utility functions
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md)
  - [Decoding JWT Claims Set](functions/util_decode_jwt.decodeJwt.md) prior to its validation

### Encrypted JSON Web Tokens

The `jose` module supports encrypted JSON Web Tokens and provides functionality for encrypting and decrypting tokens, as well as their JWT Claims Set validation.

- [Decryption & JWT Claims Set Validation](functions/jwt_decrypt.jwtDecrypt.md) using the `jwtDecrypt` function
- [Encryption](classes/jwt_encrypt.EncryptJWT.md) using the `EncryptJWT` class
- Utility functions
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md)

### Key Utilities

The `jose` module supports importing, exporting, and generating keys and secrets in various formats, including PEM formats like SPKI, X.509 certificate, and PKCS #8, as well as JSON Web Key (JWK).

- Key Import Functions
  - [JWK Import](functions/key_import.importJWK.md)
  - [Public Key Import (SPKI)](functions/key_import.importSPKI.md)
  - [Public Key Import (X.509 Certificate)](functions/key_import.importX509.md)
  - [Private Key Import (PKCS #8)](functions/key_import.importPKCS8.md)
- Key and Secret Generation Functions
  - [Asymmetric Key Pair Generation](functions/key_generate_key_pair.generateKeyPair.md)
  - [Symmetric Secret Generation](functions/key_generate_secret.generateSecret.md)
- Key Export Functions
  - [JWK Export](functions/key_export.exportJWK.md)
  - [Private Key Export](functions/key_export.exportPKCS8.md)
  - [Public Key Export](functions/key_export.exportSPKI.md)

### JSON Web Signature (JWS)

The `jose` module supports signing and verification of JWS messages with arbitrary payloads in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Signing - [Compact](classes/jws_compact_sign.CompactSign.md), [Flattened JSON](classes/jws_flattened_sign.FlattenedSign.md), [General JSON](classes/jws_general_sign.GeneralSign.md)
- Verification - [Compact](functions/jws_compact_verify.compactVerify.md), [Flattened JSON](functions/jws_flattened_verify.flattenedVerify.md), [General JSON](functions/jws_general_verify.generalVerify.md)
  - [Verify using a remote JWKS](functions/jwks_remote.createRemoteJWKSet.md)
  - [Verify using a local JWKS](functions/jwks_local.createLocalJWKSet.md)
- Utility functions
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md)

### JSON Web Encryption (JWE)

The `jose` module supports encryption and decryption of JWE messages with arbitrary plaintext in Compact, Flattened JSON, and General JSON serialization syntaxes.

- Encryption - [Compact](classes/jwe_compact_encrypt.CompactEncrypt.md), [Flattened JSON](classes/jwe_flattened_encrypt.FlattenedEncrypt.md), [General JSON](classes/jwe_general_encrypt.GeneralEncrypt.md)
- Decryption - [Compact](functions/jwe_compact_decrypt.compactDecrypt.md), [Flattened JSON](functions/jwe_flattened_decrypt.flattenedDecrypt.md), [General JSON](functions/jwe_general_decrypt.generalDecrypt.md)
- Utility functions
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md)

### Other

The following are additional features and utilities provided by the `jose` module:

- [Calculating JWK Thumbprint](functions/jwk_thumbprint.calculateJwkThumbprint.md)
- [Calculating JWK Thumbprint URI](functions/jwk_thumbprint.calculateJwkThumbprintUri.md)
- [Verification using a JWK Embedded in a JWS Header](functions/jwk_embedded.EmbeddedJWK.md)
- [Unsecured JWT](classes/jwt_unsecured.UnsecuredJWT.md)
- [JOSE Errors](modules/util_errors.md)
