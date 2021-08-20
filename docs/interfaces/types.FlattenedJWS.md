# Interface: FlattenedJWS

[types](../modules/types.md).FlattenedJWS

Flattened JWS definition. Payload is returned as an empty
string when JWS Unencoded Payload Option
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

[types.d.ts:167](https://github.com/panva/jose/blob/v3.15.0/src/types.d.ts#L167)

___

### payload

• **payload**: `string`

#### Overrides

Partial.payload

#### Defined in

[types.d.ts:217](https://github.com/panva/jose/blob/v3.15.0/src/types.d.ts#L217)

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

[types.d.ts:182](https://github.com/panva/jose/blob/v3.15.0/src/types.d.ts#L182)

___

### signature

• **signature**: `string`

#### Overrides

Partial.signature

#### Defined in

[types.d.ts:218](https://github.com/panva/jose/blob/v3.15.0/src/types.d.ts#L218)
