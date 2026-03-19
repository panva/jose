# Interface: GeneralJWE

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

General JWE JSON Serialization Syntax token.

## Properties

### ciphertext

• **ciphertext**: `string`

The "ciphertext" member MUST be present and contain the value BASE64URL(JWE Ciphertext).

***

### recipients

• **recipients**: [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)\<[`FlattenedJWE`](FlattenedJWE.md), `"header"` \| `"encrypted_key"`\>[]

***

### aad?

• `optional` **aad?**: `string`

The "aad" member MUST be present and contain the value BASE64URL(JWE AAD)) when the JWE AAD
value is non-empty; otherwise, it MUST be absent. A JWE AAD value can be included to supply a
base64url-encoded value to be integrity protected but not encrypted.

***

### iv?

• `optional` **iv?**: `string`

The "iv" member MUST be present and contain the value BASE64URL(JWE Initialization Vector) when
the JWE Initialization Vector value is non-empty; otherwise, it MUST be absent.

***

### protected?

• `optional` **protected?**: `string`

The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWE Protected
Header)) when the JWE Protected Header value is non-empty; otherwise, it MUST be absent. These
Header Parameter values are integrity protected.

***

### tag?

• `optional` **tag?**: `string`

The "tag" member MUST be present and contain the value BASE64URL(JWE Authentication Tag) when
the JWE Authentication Tag value is non-empty; otherwise, it MUST be absent.

***

### unprotected?

• `optional` **unprotected?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

The "unprotected" member MUST be present and contain the value JWE Shared Unprotected Header
when the JWE Shared Unprotected Header value is non-empty; otherwise, it MUST be absent. This
value is represented as an unencoded JSON object, rather than as a string. These Header
Parameter values are not integrity protected.
