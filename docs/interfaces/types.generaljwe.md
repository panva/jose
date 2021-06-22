# Interface: GeneralJWE

[types](../modules/types.md).GeneralJWE

## Hierarchy

- `Omit`<[FlattenedJWE](types.flattenedjwe.md), ``"encrypted_key"`` \| ``"header"``\>

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

• `Optional` **aad**: `string`

The "aad" member MUST be present and contain the value
BASE64URL(JWE AAD)) when the JWE AAD value is non-empty;
otherwise, it MUST be absent.  A JWE AAD value can be included to
supply a base64url-encoded value to be integrity protected but not
encrypted.

#### Inherited from

Omit.aad

#### Defined in

[types.d.ts:318](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L318)

___

### ciphertext

• **ciphertext**: `string`

The "ciphertext" member MUST be present and contain the value
BASE64URL(JWE Ciphertext).

#### Inherited from

Omit.ciphertext

#### Defined in

[types.d.ts:324](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L324)

___

### iv

• **iv**: `string`

The "iv" member MUST be present and contain the value
BASE64URL(JWE Initialization Vector) when the JWE Initialization
Vector value is non-empty; otherwise, it MUST be absent.

#### Inherited from

Omit.iv

#### Defined in

[types.d.ts:348](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L348)

___

### protected

• `Optional` **protected**: `string`

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWE Protected Header)) when the JWE Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

#### Inherited from

Omit.protected

#### Defined in

[types.d.ts:356](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L356)

___

### recipients

• **recipients**: `Pick`<[FlattenedJWE](types.flattenedjwe.md), ``"header"`` \| ``"encrypted_key"``\>[]

#### Defined in

[types.d.ts:376](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L376)

___

### tag

• **tag**: `string`

The "tag" member MUST be present and contain the value
BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
value is non-empty; otherwise, it MUST be absent.

#### Inherited from

Omit.tag

#### Defined in

[types.d.ts:363](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L363)

___

### unprotected

• `Optional` **unprotected**: [JWEHeaderParameters](types.jweheaderparameters.md)

The "unprotected" member MUST be present and contain the value JWE
Shared Unprotected Header when the JWE Shared Unprotected Header
value is non-empty; otherwise, it MUST be absent.  This value is
represented as an unencoded JSON object, rather than as a string.
These Header Parameter values are not integrity protected.

#### Inherited from

Omit.unprotected

#### Defined in

[types.d.ts:372](https://github.com/panva/jose/blob/v3.13.0/src/types.d.ts#L372)
