# Interface: FlattenedJWSInput

Flattened JWS definition for verify function inputs, allows payload as
Uint8Array for detached signature validation.

## Table of contents

### Properties

- [header](types.FlattenedJWSInput.md#header)
- [payload](types.FlattenedJWSInput.md#payload)
- [protected](types.FlattenedJWSInput.md#protected)
- [signature](types.FlattenedJWSInput.md#signature)

## Properties

### header

• `Optional` **header**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

___

### payload

• **payload**: `string` \| `Uint8Array`

The "payload" member MUST be present and contain the value
BASE64URL(JWS Payload). When RFC7797 "b64": false is used
the value passed may also be a Uint8Array.

___

### protected

• `Optional` **protected**: `string`

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.

___

### signature

• **signature**: `string`

The "signature" member MUST be present and contain the value
BASE64URL(JWS Signature).
