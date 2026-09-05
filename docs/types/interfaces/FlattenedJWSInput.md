# Interface: FlattenedJWSInput

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Flattened JWS verification input.

The payload may be a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for detached signature validation.

## Properties

### payload

• **payload**: `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Base64url-encoded payload; with `b64: false`, supply an unencoded string or Uint8Array.

***

### signature

• **signature**: `string`

Base64url-encoded signature or MAC.

***

### header?

• `optional` **header?**: [`JWSHeaderParameters`](JWSHeaderParameters.md)

JWS Unprotected Header as a JSON object. Not integrity protected; omit when empty.

***

### protected?

• `optional` **protected?**: `string`

Base64url-encoded UTF-8 JWS Protected Header. Integrity protected; omit when empty.
