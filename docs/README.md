# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK with no dependencies using native crypto runtimes

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Available modules

- JSON Web Tokens (JWT)
  - [Signing](classes/jwt_sign.signjwt.md#readme)
  - [Verification & Claims Set Validation](functions/jwt_verify.jwtverify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](classes/jwt_encrypt.encryptjwt.md#readme)
    - [Decryption & Claims Set Validation](functions/jwt_decrypt.jwtdecrypt.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](classes/jwe_compact_encrypt.compactencrypt.md#readme), [Flattened](classes/jwe_flattened_encrypt.flattenedencrypt.md#readme)
  - Decryption - [Compact](functions/jwe_compact_decrypt.compactdecrypt.md#readme), [Flattened](functions/jwe_flattened_decrypt.flatteneddecrypt.md#readme), [General](functions/jwe_general_decrypt.generaldecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](classes/jws_compact_sign.compactsign.md#readme), [Flattened](classes/jws_flattened_sign.flattenedsign.md#readme), [General](classes/jws_general_sign.generalsign.md#readme)
  - Verification - [Compact](functions/jws_compact_verify.compactverify.md#readme), [Flattened](functions/jws_flattened_verify.flattenedverify.md#readme), [General](functions/jws_general_verify.generalverify.md#readme)
- JSON Web Key (JWK)
  - [Parsing (JWK to KeyLike)](functions/jwk_parse.parsejwk.md#readme)
  - [Conversion (KeyLike to JWK)](functions/jwk_from_key_like.fromkeylike.md#readme)
  - [Thumbprints](functions/jwk_thumbprint.calculatethumbprint.md#readme)
  - [EmbeddedJWK](functions/jwk_embedded.embeddedjwk.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a remote JWKSet](functions/jwks_remote.createremotejwkset.md#readme)
- Key Pair or Secret Generation (Generate KeyLike)
  - [Asymmetric Key Pair Generation](functions/util_generate_key_pair.generatekeypair.md#readme)
  - [Symmetric Secret Generation](functions/util_generate_secret.generatesecret.md#readme)
- Utilities
  - [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeprotectedheader.md#readme)
- [Unsecured JWT](classes/jwt_unsecured.unsecuredjwt.md#readme)
- [JOSE Errors](modules/util_errors.md#readme)

[support-sponsor]: https://github.com/sponsors/panva
