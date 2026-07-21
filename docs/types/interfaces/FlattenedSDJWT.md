# Interface: FlattenedSDJWT

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Flattened JWS JSON Serialization of an SD-JWT or SD-JWT+KB.

## Properties

### header

• **header**: [`SDJWTUnprotectedHeaderParameters`](SDJWTUnprotectedHeaderParameters.md)

***

### payload

• **payload**: `string`

The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When RFC7797
"b64": false is used the value passed may also be a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

***

### signature

• **signature**: `string`

The "signature" member MUST be present and contain the value BASE64URL(JWS Signature).

***

### protected?

• `optional` **protected?**: `string`

The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWS Protected
Header)) when the JWS Protected Header value is non-empty; otherwise, it MUST be absent. These
Header Parameter values are integrity protected.
