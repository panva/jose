# Interface: FlattenedJWS

[types](../modules/types.md).FlattenedJWS

Flattened JWS definition. Payload is an optional return property, it
is not returned when JWS Unencoded Payload Option
[RFC7797](https://tools.ietf.org/html/rfc7797) is used.

## Hierarchy

- `Partial`<[`FlattenedJWSInput`](types.FlattenedJWSInput.md)\>

  ↳ **`FlattenedJWS`**

## Table of contents

### Properties

- [header](types.FlattenedJWS.md#header)
- [payload](types.FlattenedJWS.md#payload)
- [protected](types.FlattenedJWS.md#protected)
- [signature](types.FlattenedJWS.md#signature)

## Properties

### header

• `Optional` **header**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

#### Inherited from

Partial.header

#### Defined in

[types.d.ts:168](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L168)

___

### payload

• `Optional` **payload**: `string`

#### Overrides

Partial.payload

#### Defined in

[types.d.ts:218](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L218)

___

### protected

• `Optional` **protected**: `string`

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

#### Inherited from

Partial.protected

#### Defined in

[types.d.ts:183](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L183)

___

### signature

• **signature**: `string`

#### Overrides

Partial.signature

#### Defined in

[types.d.ts:219](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L219)
