# Interface: GeneralJWE

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

General JWE JSON Serialization token.

## Properties

### ciphertext

• **ciphertext**: `string`

Base64url-encoded ciphertext.

***

### recipients

• **recipients**: [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)\<[`FlattenedJWE`](FlattenedJWE.md), `"header"` \| `"encrypted_key"`\>[]

***

### aad?

• `optional` **aad?**: `string`

Base64url-encoded additional authenticated data; integrity protected but not encrypted. Omit
when empty.

***

### iv?

• `optional` **iv?**: `string`

Base64url-encoded initialization vector. Omit when empty.

***

### protected?

• `optional` **protected?**: `string`

Base64url-encoded UTF-8 JWE Protected Header. Integrity protected; omit when empty.

***

### tag?

• `optional` **tag?**: `string`

Base64url-encoded authentication tag. Omit when empty.

***

### unprotected?

• `optional` **unprotected?**: [`JWEHeaderParameters`](JWEHeaderParameters.md)

JWE Shared Unprotected Header as a JSON object. Not integrity protected; omit when empty.
