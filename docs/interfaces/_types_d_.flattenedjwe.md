# Interface: FlattenedJWE

Flattened JWE definition.

## Index

### Properties

* [aad](_types_d_.flattenedjwe.md#aad)
* [ciphertext](_types_d_.flattenedjwe.md#ciphertext)
* [encrypted\_key](_types_d_.flattenedjwe.md#encrypted_key)
* [header](_types_d_.flattenedjwe.md#header)
* [iv](_types_d_.flattenedjwe.md#iv)
* [protected](_types_d_.flattenedjwe.md#protected)
* [tag](_types_d_.flattenedjwe.md#tag)
* [unprotected](_types_d_.flattenedjwe.md#unprotected)

## Properties

### aad

• `Optional` **aad**: string

*Defined in [src/types.d.ts:228](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L228)*

The "aad" member MUST be present and contain the value
BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
otherwise, it MUST be absent.  A JWE AAD value can be included to
supply a base64url-encoded value to be integrity protected but not
encrypted.

___

### ciphertext

•  **ciphertext**: string

*Defined in [src/types.d.ts:234](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L234)*

The "ciphertext" member MUST be present and contain the value
BASE64URL(JWE Ciphertext).

___

### encrypted\_key

• `Optional` **encrypted\_key**: string

*Defined in [src/types.d.ts:241](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L241)*

The "encrypted_key" member MUST be present and contain the value
BASE64URL(JWE Encrypted Key) when the JWE Encrypted Key value is
non-empty; otherwise, it MUST be absent.

___

### header

• `Optional` **header**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:251](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L251)*

The "header" member MUST be present and contain the value JWE Per-
Recipient Unprotected Header when the JWE Per-Recipient
Unprotected Header value is non-empty; otherwise, it MUST be
absent.  This value is represented as an unencoded JSON object,
rather than as a string.  These Header Parameter values are not
integrity protected.

___

### iv

•  **iv**: string

*Defined in [src/types.d.ts:258](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L258)*

The "iv" member MUST be present and contain the value
BASE64URL(JWE Initialization Vector) when the JWE Initialization
Vector value is non-empty; otherwise, it MUST be absent.

___

### protected

• `Optional` **protected**: string

*Defined in [src/types.d.ts:266](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L266)*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

___

### tag

•  **tag**: string

*Defined in [src/types.d.ts:273](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L273)*

The "tag" member MUST be present and contain the value
BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
value is non-empty; otherwise, it MUST be absent.

___

### unprotected

• `Optional` **unprotected**: [JWEHeaderParameters](_types_d_.jweheaderparameters.md)

*Defined in [src/types.d.ts:282](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L282)*

The "unprotected" member MUST be present and contain the value JWE
Shared Unprotected Header when the JWE Shared Unprotected Header
value is non-empty; otherwise, it MUST be absent.  This value is
represented as an unencoded JSON object, rather than as a string.
These Header Parameter values are not integrity protected.
