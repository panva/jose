# Interface: FlattenedJWS

Flattened JWS definition. Payload is returned as an empty
string when JWS Unencoded Payload Option
[RFC7797](https://www.rfc-editor.org/rfc/rfc7797) is used.

## Table of contents

### Properties

- [payload](types.FlattenedJWS.md#payload)
- [signature](types.FlattenedJWS.md#signature)
- [header](types.FlattenedJWS.md#header)
- [protected](types.FlattenedJWS.md#protected)

## Properties

### payload

• **payload**: `string`

___

### signature

• **signature**: `string`

___

### header

• `Optional` **header**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

The "header" member MUST be present and contain the value JWS
Unprotected Header when the JWS Unprotected Header value is non-
empty; otherwise, it MUST be absent.  This value is represented as
an unencoded JSON object, rather than as a string.  These Header
Parameter values are not integrity protected.

___

### protected

• `Optional` **protected**: `string`

The "protected" member MUST be present and contain the value
BASE64URL(UTF8(JWS Protected Header)) when the JWS Protected
Header value is non-empty; otherwise, it MUST be absent.  These
Header Parameter values are integrity protected.
