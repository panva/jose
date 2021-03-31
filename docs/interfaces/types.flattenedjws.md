# Interface: FlattenedJWS

[types](../modules/types.md).FlattenedJWS

Flattened JWS definition. Payload is an optional return property, it
is not returned when JWS Unencoded Payload Option
[RFC7797](https://tools.ietf.org/html/rfc7797) is used.

## Hierarchy

* *Partial*<[*FlattenedJWSInput*](types.flattenedjwsinput.md)\>

  ↳ **FlattenedJWS**

## Table of contents

### Properties

- [header](types.flattenedjws.md#header)
- [payload](types.flattenedjws.md#payload)
- [protected](types.flattenedjws.md#protected)
- [signature](types.flattenedjws.md#signature)

## Properties

### header

• `Optional` **header**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

Inherited from: void

Defined in: [types.d.ts:162](https://github.com/panva/jose/blob/main/src/types.d.ts#L162)

___

### payload

• `Optional` **payload**: *string*

Overrides: void

Defined in: [types.d.ts:212](https://github.com/panva/jose/blob/main/src/types.d.ts#L212)

___

### protected

• `Optional` **protected**: *string*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

Inherited from: void

Defined in: [types.d.ts:177](https://github.com/panva/jose/blob/main/src/types.d.ts#L177)

___

### signature

• **signature**: *string*

Overrides: void

Defined in: [types.d.ts:213](https://github.com/panva/jose/blob/main/src/types.d.ts#L213)
