# Interface: FlattenedJWSInput

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Flattened JWS definition for verify function inputs, allows payload as [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for
detached signature validation.

## Properties

### payload

• **payload**: `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When RFC7797
"b64": false is used the value passed may also be a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

***

### signature

• **signature**: `string`

The "signature" member MUST be present and contain the value BASE64URL(JWS Signature).

***

### header?

• `optional` **header**: [`JWSHeaderParameters`](JWSHeaderParameters.md)

The "header" member MUST be present and contain the value JWS Unprotected Header when the JWS
Unprotected Header value is non- empty; otherwise, it MUST be absent. This value is represented
as an unencoded JSON object, rather than as a string. These Header Parameter values are not
integrity protected.

***

### protected?

• `optional` **protected**: `string`

The "protected" member MUST be present and contain the value BASE64URL(UTF8(JWS Protected
Header)) when the JWS Protected Header value is non-empty; otherwise, it MUST be absent. These
Header Parameter values are integrity protected.
