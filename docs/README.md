# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK with no dependencies using native crypto runtimes

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Available modules

- JSON Web Tokens (JWT)
  - [Signing](classes/_jwt_sign_.signjwt.md#readme)
  - [Verification & Claims Set Validation](functions/_jwt_verify_.jwtverify.md#readme)
  - Encrypted JSON Web Tokens
    - [Encryption](classes/_jwt_encrypt_.encryptjwt.md#readme)
    - [Decryption & Claims Set Validation](functions/_jwt_decrypt_.jwtdecrypt.md#readme)
- JSON Web Encryption (JWE)
  - Encryption - [Compact](classes/_jwe_compact_encrypt_.compactencrypt.md#readme), [Flattened](classes/_jwe_flattened_encrypt_.flattenedencrypt.md#readme)
  - Decryption - [Compact](functions/_jwe_compact_decrypt_.compactdecrypt.md#readme), [Flattened](functions/_jwe_flattened_decrypt_.flatteneddecrypt.md#readme)
- JSON Web Signature (JWS)
  - Signing - [Compact](classes/_jws_compact_sign_.compactsign.md#readme), [Flattened](classes/_jws_flattened_sign_.flattenedsign.md#readme)
  - Verification - [Compact](functions/_jws_compact_verify_.compactverify.md#readme), [Flattened](functions/_jws_flattened_verify_.flattenedverify.md#readme)
- JSON Web Key (JWK)
  - [Parsing (JWK to KeyLike)](functions/_jwk_parse_.parsejwk.md#readme)
  - [Conversion (KeyLike to JWK)](functions/_jwk_from_key_like_.fromkeylike.md#readme)
  - [Thumbprints](functions/_jwk_thumbprint_.calculatethumbprint.md#readme)
  - [EmbeddedJWK](functions/_jwk_embedded_.embeddedjwk.md#readme)
- JSON Web Key Set (JWKS)
  - [Verify using a remote JWKSet](functions/_jwks_remote_.createremotejwkset.md#readme)
- Key Pair or Secret Generation
  - [Asymmetric Key Pair Generation](functions/_util_generate_key_pair_.generatekeypair.md#readme)
  - [Symmetric Secret Generation](functions/_util_generate_secret_.generatesecret.md#readme)
- [Unsecured JWT](classes/_jwt_unsecured_.unsecuredjwt.md#readme)
- [JOSE Errors](modules/_util_errors_.md)

[support-sponsor]: https://github.com/sponsors/panva
