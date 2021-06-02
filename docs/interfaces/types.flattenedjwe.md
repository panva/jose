# Interface: FlattenedJWE

[types](../modules/types.md).FlattenedJWE

Flattened JWE definition.

## Table of contents

### Properties

- [aad](types.flattenedjwe.md#aad)
- [ciphertext](types.flattenedjwe.md#ciphertext)
- [encrypted\_key](types.flattenedjwe.md#encrypted_key)
- [header](types.flattenedjwe.md#header)
- [iv](types.flattenedjwe.md#iv)
- [protected](types.flattenedjwe.md#protected)
- [tag](types.flattenedjwe.md#tag)
- [unprotected](types.flattenedjwe.md#unprotected)

## Properties

### aad

• `Optional` **aad**: *string*

The "aad" member MUST be present and contain the value
BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
otherwise, it MUST be absent.  A JWE AAD value can be included to
supply a base64url-encoded value to be integrity protected but not
encrypted.

Defined in: [types.d.ts:318](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L318)

___

### ciphertext

• **ciphertext**: *string*

The "ciphertext" member MUST be present and contain the value
BASE64URL(JWE Ciphertext).

Defined in: [types.d.ts:324](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L324)

___

### encrypted\_key

• `Optional` **encrypted\_key**: *string*

The "encrypted_key" member MUST be present and contain the value
BASE64URL(JWE Encrypted Key) when the JWE Encrypted Key value is
non-empty; otherwise, it MUST be absent.

Defined in: [types.d.ts:331](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L331)

___

### header

• `Optional` **header**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

The "header" member MUST be present and contain the value JWE Per-
Recipient Unprotected Header when the JWE Per-Recipient
Unprotected Header value is non-empty; otherwise, it MUST be
absent.  This value is represented as an unencoded JSON object,
rather than as a string.  These Header Parameter values are not
integrity protected.

Defined in: [types.d.ts:341](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L341)

___

### iv

• **iv**: *string*

The "iv" member MUST be present and contain the value
BASE64URL(JWE Initialization Vector) when the JWE Initialization
Vector value is non-empty; otherwise, it MUST be absent.

Defined in: [types.d.ts:348](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L348)

___

### protected

• `Optional` **protected**: *string*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

Defined in: [types.d.ts:356](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L356)

___

### tag

• **tag**: *string*

The "tag" member MUST be present and contain the value
BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
value is non-empty; otherwise, it MUST be absent.

Defined in: [types.d.ts:363](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L363)

___

### unprotected

• `Optional` **unprotected**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

The "unprotected" member MUST be present and contain the value JWE
Shared Unprotected Header when the JWE Shared Unprotected Header
value is non-empty; otherwise, it MUST be absent.  This value is
represented as an unencoded JSON object, rather than as a string.
These Header Parameter values are not integrity protected.

Defined in: [types.d.ts:372](https://github.com/panva/jose/blob/v3.12.3/src/types.d.ts#L372)
