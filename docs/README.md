# `jose` Modules API Documentation

> "JSON Web Almost Everything" - JWA, JWS, JWE, JWT, JWK, JWKS with no dependencies using runtime's native crypto.

## Support

If you or your business use `jose`, please consider becoming a [sponsor][support-sponsor] so I can continue maintaining it and adding new features carefree.

## Available modules

| Spec  | Documentation |
| :---- | :------------ | 
| JSON Web Signature (**JWS**)<br/>*RFC7515* | Signing<br/>[Compact](classes/jws_compact_sign.CompactSign.md#readme), [Flattened](classes/jws_flattened_sign.FlattenedSign.md#readme), [General](classes/jws_general_sign.GeneralSign.md#readme)<br/><br/>Verification<br/>[Compact](functions/jws_compact_verify.compactVerify.md#readme), [Flattened](functions/jws_flattened_verify.flattenedVerify.md#readme), [General](functions/jws_general_verify.generalVerify.md#readme) |
| JSON Web Encryption (**JWE**)<br/>*RFC7516*| Encryption<br/>[Compact](classes/jwe_compact_encrypt.CompactEncrypt.md#readme), [Flattened](classes/jwe_flattened_encrypt.FlattenedEncrypt.md#readme)<br/><br/>Decryption<br/>[Compact](functions/jwe_compact_decrypt.compactDecrypt.md#readme), [Flattened](functions/jwe_flattened_decrypt.flattenedDecrypt.md#readme), [General](functions/jwe_general_decrypt.generalDecrypt.md#readme) |
| JSON Web Key (**JWK**)<br/>*RFC7517* | [EmbeddedJWK](functions/jwk_embedded.EmbeddedJWK.md#readme) |
| JSON Web Token (**JWT**)<br/>*RFC7519* | [Signing](classes/jwt_sign.SignJWT.md#readme)<br/>[Verification & Claims Set Validation](functions/jwt_verify.jwtVerify.md#readme)<br/><br/>Encrypted JSON Web Token<br/>[Encryption](classes/jwt_encrypt.EncryptJWT.md#readme)<br/>[Decryption & Claims Set Validation](functions/jwt_decrypt.jwtDecrypt.md#readme) |
| JSON Web Key Thumbprint<br/>*RFC7638* | [Thumbprints](functions/jwk_thumbprint.calculateJwkThumbprint.md#readme) |
| Key Pair or Secret Generation | [Asymmetric Key Pair Generation](functions/key_generate_key_pair.generateKeyPair.md#readme)<br/>[Symmetric Secret Generation](functions/key_generate_secret.generateSecret.md#readme) |
| Key Import| [JWK Import](functions/key_import.importJWK.md#readme)<br/>[Public Key Import (SPKI)](functions/key_import.importSPKI.md#readme)<br/>[Public Key Import (X.509 Certificate)](functions/key_import.importX509.md#readme)<br/>[Private Key Import (PKCS #8)](functions/key_import.importPKCS8.md#readme) |
| Key Export | [JWK Export](functions/key_export.exportJWK.md#readme)<br/>[Private Key Export](functions/key_export.exportPKCS8.md#readme)<br/>[Public Key Export](functions/key_export.exportSPKI.md#readme) |
| Base64Url<br/>*RFC4648* | [Base64Url Encode](functions/util_base64url.encode.md)<br/>[Base64Url Decode](functions/util_base64url.decode.md) |
| Utilities | [Decoding Token's Protected Header](functions/util_decode_protected_header.decodeProtectedHeader.md#readme)<br/>[Unsecured JWT](classes/jwt_unsecured.UnsecuredJWT.md#readme)<br/>[JOSE Errors](modules/util_errors.md#readme) |

[support-sponsor]: https://github.com/sponsors/panva
