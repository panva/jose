# Interface: FlattenedJWE

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Flattened JWE JSON Serialization token.

## See

[RFC 7516, Section 7.2.2](https://www.rfc-editor.org/info/rfc7516/#section-7.2.2)

## Properties

### ciphertext

• **ciphertext**: `string`

Base64url-encoded JWE Ciphertext.

***

### aad?

• `optional` **aad?**: `string`

Base64url-encoded JWE AAD; integrity protected but not encrypted. Omit when empty.

***

### encrypted\_key?

• `optional` **encrypted\_key?**: `string`

Base64url-encoded JWE Encrypted Key. Omit when empty.

***

### header?

• `optional` **header?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Per-Recipient Unprotected Header as a JSON object. Not integrity protected; omit when
empty.

***

### iv?

• `optional` **iv?**: `string`

Base64url-encoded JWE Initialization Vector. Omit when empty.

***

### protected?

• `optional` **protected?**: `string`

Base64url-encoded UTF-8 JWE Protected Header. Integrity protected; omit when empty.

***

### tag?

• `optional` **tag?**: `string`

Base64url-encoded JWE Authentication Tag. Omit when empty.

***

### unprotected?

• `optional` **unprotected?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Shared Unprotected Header as a JSON object. Not integrity protected; omit when empty.
