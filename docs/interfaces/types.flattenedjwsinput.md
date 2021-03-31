# Interface: FlattenedJWSInput

[types](../modules/types.md).FlattenedJWSInput

Flattened JWS definition for verify function inputs, allows payload as
Uint8Array for detached signature validation.

## Table of contents

### Properties

- [header](types.flattenedjwsinput.md#header)
- [payload](types.flattenedjwsinput.md#payload)
- [protected](types.flattenedjwsinput.md#protected)
- [signature](types.flattenedjwsinput.md#signature)

## Properties

### header

• `Optional` **header**: [*JWSHeaderParameters*](types.jwsheaderparameters.md)

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

Defined in: [types.d.ts:162](https://github.com/panva/jose/blob/main/src/types.d.ts#L162)

___

### payload

• **payload**: *string* \| *Uint8Array*

The "payload" member MUST be present and contain the value
BASE64URL(JWS Payload). When RFC7797 "b64": false is used
the value passed may also be a Uint8Array.

Defined in: [types.d.ts:169](https://github.com/panva/jose/blob/main/src/types.d.ts#L169)

___

### protected

• `Optional` **protected**: *string*

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

Defined in: [types.d.ts:177](https://github.com/panva/jose/blob/main/src/types.d.ts#L177)

___

### signature

• **signature**: *string*

The "signature" member MUST be present and contain the value
BASE64URL(JWS Signature).

Defined in: [types.d.ts:183](https://github.com/panva/jose/blob/main/src/types.d.ts#L183)
