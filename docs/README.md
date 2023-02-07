# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS with no dependencies using runtime's native crypto.

## [💗 Help the project](https://github.com/sponsors/panva)

## Available modules

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
import * as jose from 'https://deno.land/x/jose@v4.11.3/index.ts'
```

- JSON Web Tokens (JWT)
  - [Signing](classes/jwt_sign.SignJWT.md#readme)
  - [Verification & JWT Claims Set Validation](functions/jwt_verify.jwtVerify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](classes/jwt_encrypt.EncryptJWT.md#readme)
    - [Decryption & JWT Claims Set Validation](functions/jwt_decrypt.jwtDecrypt.md#readme)
- Key Import
  - [JWK Import](functions/key_import.importJWK.md#readme)
  - [Public Key Import (SPKI)](functions/key_import.importSPKI.md#readme)
  - [Public Key Import (X.509 Certificate)](functions/key_import.importX509.md#readme)
  - [Private Key Import (PKCS #8)](functions/key_import.importPKCS8.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](classes/jwe_compact_encrypt.CompactEncrypt.md#readme), [Flattened](classes/jwe_flattened_encrypt.FlattenedEncrypt.md#readme), [General](classes/jwe_general_encrypt.GeneralEncrypt.md#readme)
  - Decryption - [Compact](functions/jwe_compact_decrypt.compactDecrypt.md#readme), [Flattened](functions/jwe_flattened_decrypt.flattenedDecrypt.md#readme), [General](functions/jwe_general_decrypt.generalDecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](classes/jws_compact_sign.CompactSign.md#readme), [Flattened](classes/jws_flattened_sign.FlattenedSign.md#readme), [General](classes/jws_general_sign.GeneralSign.md#readme)
  - Verification - [Compact](functions/jws_compact_verify.compactVerify.md#readme), [Flattened](functions/jws_flattened_verify.flattenedVerify.md#readme), [General](functions/jws_general_verify.generalVerify.md#readme)
- JSON Web Key (JWK)
  - [Calculating JWK Thumbprint](functions/jwk_thumbprint.calculateJwkThumbprint.md#readme)
  - [Calculating JWK Thumbprint URI](functions/jwk_thumbprint.calculateJwkThumbprintUri.md#readme)
  - [Verification using a JWK Embedded in a JWS Header](functions/jwk_embedded.EmbeddedJWK.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a local JWKSet](functions/jwks_local.createLocalJWKSet.md#readme)
  - [Verify using a remote JWKSet](functions/jwks_remote.createRemoteJWKSet.md#readme)
- Key Pair or Secret Generation
  - [Asymmetric Key Pair Generation](functions/key_generate_key_pair.generateKeyPair.md#readme)
  - [Symmetric Secret Generation](functions/key_generate_secret.generateSecret.md#readme)
- Key Export
  - [JWK Export](functions/key_export.exportJWK.md#readme)
  - [Private Key Export](functions/key_export.exportPKCS8.md#readme)
  - [Public Key Export](functions/key_export.exportSPKI.md#readme)
- Utilities
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md#readme)
  - [Decoding JWT Claims Set](functions/util_decode_jwt.decodeJwt.md#readme)
- [Unsecured JWT](classes/jwt_unsecured.UnsecuredJWT.md#readme)
- [JOSE Errors](modules/util_errors.md#readme)

[support-sponsor]: https://github.com/sponsors/panva
