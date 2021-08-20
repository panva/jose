# Interface: GeneralJWE

[types](../modules/types.md).GeneralJWE

## Hierarchy

- `Omit`<[`FlattenedJWE`](types.FlattenedJWE.md), ``"encrypted_key"`` \| ``"header"``\>

  ↳ **`GeneralJWE`**

## Table of contents

### Properties

- [aad](types.GeneralJWE.md#aad)
- [ciphertext](types.GeneralJWE.md#ciphertext)
- [iv](types.GeneralJWE.md#iv)
- [protected](types.GeneralJWE.md#protected)
- [recipients](types.GeneralJWE.md#recipients)
- [tag](types.GeneralJWE.md#tag)
- [unprotected](types.GeneralJWE.md#unprotected)

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

[types.d.ts:324](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L324)

___

### ciphertext

• **ciphertext**: `string`

The "ciphertext" member MUST be present and contain the value
BASE64URL(JWE Ciphertext).

#### Inherited from

Omit.ciphertext

#### Defined in

[types.d.ts:330](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L330)

___

### iv

• **iv**: `string`

The "iv" member MUST be present and contain the value
BASE64URL(JWE Initialization Vector) when the JWE Initialization
Vector value is non-empty; otherwise, it MUST be absent.

#### Inherited from

Omit.iv

#### Defined in

[types.d.ts:354](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L354)

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

[types.d.ts:362](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L362)

___

### recipients

• **recipients**: `Pick`<[`FlattenedJWE`](types.FlattenedJWE.md), ``"header"`` \| ``"encrypted_key"``\>[]

#### Defined in

[types.d.ts:382](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L382)

___

### tag

• **tag**: `string`

The "tag" member MUST be present and contain the value
BASE64URL(JWE Authentication Tag) when the JWE Authentication Tag
value is non-empty; otherwise, it MUST be absent.

#### Inherited from

Omit.tag

#### Defined in

[types.d.ts:369](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L369)

___

### unprotected

• `Optional` **unprotected**: [`JWEHeaderParameters`](types.JWEHeaderParameters.md)

The "unprotected" member MUST be present and contain the value JWE
Shared Unprotected Header when the JWE Shared Unprotected Header
value is non-empty; otherwise, it MUST be absent.  This value is
represented as an unencoded JSON object, rather than as a string.
These Header Parameter values are not integrity protected.

#### Inherited from

Omit.unprotected

#### Defined in

[types.d.ts:378](https://github.com/panva/jose/blob/v3.15.2/src/types.d.ts#L378)
