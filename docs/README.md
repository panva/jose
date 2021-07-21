# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK with no dependencies using native crypto runtimes

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Available modules

- JSON Web Tokens (JWT)
  - [Signing](classes/jwt_sign.SignJWT.md#readme)
  - [Verification & Claims Set Validation](functions/jwt_verify.SignJWT.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](classes/jwt_encrypt.EncryptJWT.md#readme)
    - [Decryption & Claims Set Validation](functions/jwt_decrypt.jwtDecrypt.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](classes/jwe_compact_encrypt.CompactEncrypt.md#readme), [Flattened](classes/jwe_flattened_encrypt.FlattenedEncrypt.md#readme)
  - Decryption - [Compact](functions/jwe_compact_decrypt.compactDecrypt.md#readme), [Flattened](functions/jwe_flattened_decrypt.flattenedDecrypt.md#readme), [General](functions/jwe_general_decrypt.generalDecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](classes/jws_compact_sign.CompactSign.md#readme), [Flattened](classes/jws_flattened_sign.FlattenedSign.md#readme), [General](classes/jws_general_sign.GeneralSign.md#readme)
  - Verification - [Compact](functions/jws_compact_verify.compactVerify.md#readme), [Flattened](functions/jws_flattened_verify.flattenedVerify.md#readme), [General](functions/jws_general_verify.generalVerify.md#readme)
- JSON Web Key (JWK)
  - [Parsing (JWK to KeyLike)](functions/jwk_parse.parseJwk.md#readme)
  - [Conversion (KeyLike to JWK)](functions/jwk_from_key_like.fromKeyLike.md#readme)
  - [Thumbprints](functions/jwk_thumbprint.calculateThumbprint.md#readme)
  - [EmbeddedJWK](functions/jwk_embedded.EmbeddedJWK.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a remote JWKSet](functions/jwks_remote.createRemoteJWKSet.md#readme)
- Key Pair or Secret Generation (Generate KeyLike)
  - [Asymmetric Key Pair Generation](functions/util_generate_key_pair.generateKeyPair.md#readme)
  - [Symmetric Secret Generation](functions/util_generate_secret.generateSecret.md#readme)
- Utilities
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md#readme)
- [Unsecured JWT](classes/jwt_unsecured.UnsecuredJWT.md#readme)
- [JOSE Errors](modules/util_errors.md#readme)

[support-sponsor]: https://github.com/sponsors/panva
