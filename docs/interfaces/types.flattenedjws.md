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

Defined in: [types.d.ts:116](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L116)

___

### payload

• `Optional` **payload**: *string*

Overrides: void

Defined in: [types.d.ts:166](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L166)

___

### protected

• `Optional` **protected**: *string*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

Inherited from: void

Defined in: [types.d.ts:131](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L131)

___

### signature

• **signature**: *string*

Overrides: void

Defined in: [types.d.ts:167](https://github.com/panva/jose/blob/v3.11.2/src/types.d.ts#L167)
