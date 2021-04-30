# Interface: GeneralJWE

[types](../modules/types.md).GeneralJWE

## Hierarchy

* *Omit*<[*FlattenedJWE*](types.flattenedjwe.md), ``"encrypted_key"`` \| ``"header"``\>

  ↳ **GeneralJWE**

## Table of contents

### Properties

- [aad](types.generaljwe.md#aad)
- [ciphertext](types.generaljwe.md#ciphertext)
- [iv](types.generaljwe.md#iv)
- [protected](types.generaljwe.md#protected)
- [recipients](types.generaljwe.md#recipients)
- [tag](types.generaljwe.md#tag)
- [unprotected](types.generaljwe.md#unprotected)

## Properties

### aad

• `Optional` **aad**: *string*

The "aad" member MUST be present and contain the value
BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
otherwise, it MUST be absent.  A JWE AAD value can be included to
supply a base64url-encoded value to be integrity protected but not
encrypted.

Inherited from: Omit.aad

Defined in: [types.d.ts:314](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L314)

___

### ciphertext

• **ciphertext**: *string*

The "ciphertext" member MUST be present and contain the value
BASE64URL(JWE Ciphertext).

Inherited from: Omit.ciphertext

Defined in: [types.d.ts:320](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L320)

___

### iv

• **iv**: *string*

The "iv" member MUST be present and contain the value
BASE64URL(JWE Initialization Vector) when the JWE Initialization
Vector value is non-empty; otherwise, it MUST be absent.

Inherited from: Omit.iv

Defined in: [types.d.ts:344](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L344)

___

### protected

• `Optional` **protected**: *string*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

Inherited from: Omit.protected

Defined in: [types.d.ts:352](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L352)

___

### recipients

• **recipients**: *Pick*<[*FlattenedJWE*](types.flattenedjwe.md), ``"header"`` \| ``"encrypted_key"``\>[]

Defined in: [types.d.ts:372](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L372)

___

### tag

• **tag**: *string*

The "tag" member MUST be present and contain the value
BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
value is non-empty; otherwise, it MUST be absent.

Inherited from: Omit.tag

Defined in: [types.d.ts:359](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L359)

___

### unprotected

• `Optional` **unprotected**: [*JWEHeaderParameters*](types.jweheaderparameters.md)

The "unprotected" member MUST be present and contain the value JWE
Shared Unprotected Header when the JWE Shared Unprotected Header
value is non-empty; otherwise, it MUST be absent.  This value is
represented as an unencoded JSON object, rather than as a string.
These Header Parameter values are not integrity protected.

Inherited from: Omit.unprotected

Defined in: [types.d.ts:368](https://github.com/panva/jose/blob/v3.11.6/src/types.d.ts#L368)
