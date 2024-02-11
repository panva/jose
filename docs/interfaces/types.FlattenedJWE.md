# Interface: FlattenedJWE

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Flattened JWE definition.

## Table of contents

### Properties

- [ciphertext](types.FlattenedJWE.md#ciphertext)
- [aad](types.FlattenedJWE.md#aad)
- [encrypted\_key](types.FlattenedJWE.md#encrypted_key)
- [header](types.FlattenedJWE.md#header)
- [iv](types.FlattenedJWE.md#iv)
- [protected](types.FlattenedJWE.md#protected)
- [tag](types.FlattenedJWE.md#tag)
- [unprotected](types.FlattenedJWE.md#unprotected)

## Properties

### ciphertext

• **ciphertext**: `string`

The "ciphertext" member MUST be present and contain the value BASE64URL(JWE Ciphertext).

___

### aad

• `Optional` **aad**: `string`

The "aad" member MUST be present and contain the value BASE64URL(JWE AAD)) when the JWE AAD
value is non-empty; otherwise, it MUST be absent. A JWE AAD value can be included to supply a
base64url-encoded value to be integrity protected but not encrypted.

___

### encrypted\_key

• `Optional` **encrypted\_key**: `string`

The "encrypted_key" member MUST be present and contain the value BASE64URL(JWE Encrypted Key)
when the JWE Encrypted Key value is non-empty; otherwise, it MUST be absent.

___

### header

• `Optional` **header**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

The "header" member MUST be present and contain the value JWE Per- Recipient Unprotected Header
when the JWE Per-Recipient Unprotected Header value is non-empty; otherwise, it MUST be absent.
This value is represented as an unencoded JSON object, rather than as a string. These Header
Parameter values are not integrity protected.

___

### iv

• `Optional` **iv**: `string`

The "iv" member MUST be present and contain the value BASE64URL(JWE Initialization Vector) when
the JWE Initialization Vector value is non-empty; otherwise, it MUST be absent.

___

### protected

• `Optional` **protected**: `string`

The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWE Protected
Header)) when the JWE Protected Header value is non-empty; otherwise, it MUST be absent. These
Header Parameter values are integrity protected.

___

### tag

• `Optional` **tag**: `string`

The "tag" member MUST be present and contain the value BASE64URL(JWE Authentication Tag) when
the JWE Authentication Tag value is non-empty; otherwise, it MUST be absent.

___

### unprotected

• `Optional` **unprotected**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

The "unprotected" member MUST be present and contain the value JWE Shared Unprotected Header
when the JWE Shared Unprotected Header value is non-empty; otherwise, it MUST be absent. This
value is represented as an unencoded JSON object, rather than as a string. These Header
Parameter values are not integrity protected.
