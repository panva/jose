# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK with no dependencies using native crypto runtimes

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Available modules

- JSON Web Tokens (JWT)
  - [Signing](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jwt_sign.SignJWT.md#readme)
  - [Verification & Claims Set Validation](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwt_verify.jwtVerify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jwt_encrypt.EncryptJWT.md#readme)
    - [Decryption & Claims Set Validation](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwt_decrypt.jwtDecrypt.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme), [Flattened](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jwe_flattened_encrypt.FlattenedEncrypt.md#readme)
  - Decryption - [Compact](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwe_compact_decrypt.compactDecrypt.md#readme), [Flattened](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwe_flattened_decrypt.flattenedDecrypt.md#readme), [General](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwe_general_decrypt.generalDecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jws_compact_sign.CompactSign.md#readme), [Flattened](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jws_flattened_sign.FlattenedSign.md#readme), [General](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jws_general_sign.GeneralSign.md#readme)
  - Verification - [Compact](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jws_compact_verify.compactVerify.md#readme), [Flattened](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jws_flattened_verify.flattenedVerify.md#readme), [General](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jws_general_verify.generalVerify.md#readme)
- JSON Web Key (JWK)
  - [Parsing (JWK to KeyLike)](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwk_parse.parseJwk.md#readme)
  - [Conversion (KeyLike to JWK)](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwk_from_key_like.fromKeyLike.md#readme)
  - [Thumbprints](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwk_thumbprint.calculateThumbprint.md#readme)
  - [EmbeddedJWK](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwk_embedded.EmbeddedJWK.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a remote JWKSet](https://github.com/panva/jose/blob/v3.15.2/docs/functions/jwks_remote.createRemoteJWKSet.md#readme)
- Key Pair or Secret Generation (Generate KeyLike)
  - [Asymmetric Key Pair Generation](https://github.com/panva/jose/blob/v3.15.2/docs/functions/util_generate_key_pair.generateKeyPair.md#readme)
  - [Symmetric Secret Generation](https://github.com/panva/jose/blob/v3.15.2/docs/functions/util_generate_secret.generateSecret.md#readme)
- Utilities
  - [Decoding Token's Protected Header](https://github.com/panva/jose/blob/v3.15.2/docs/functions/util_decode_protected_header.decodeProtectedHeader.md#readme)
- [Unsecured JWT](https://github.com/panva/jose/blob/v3.15.2/docs/classes/jwt_unsecured.UnsecuredJWT.md#readme)
- [JOSE Errors](https://github.com/panva/jose/blob/v3.15.2/docs/modules/util_errors.md#readme)

[support-sponsor]: https://github.com/sponsors/panva
