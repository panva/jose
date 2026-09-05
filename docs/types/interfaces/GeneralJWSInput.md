# Interface: GeneralJWSInput

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

General JWS verification input.

The payload may be a [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) for detached signature validation.

## Properties

### payload

• **payload**: `string` \| [`Uint8Array`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Base64url-encoded payload; with `b64: false`, supply an unencoded string or Uint8Array.

***

### signatures

• **signatures**: [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedJWSInput`](FlattenedJWSInput.md), `"payload"`\>[]

The "signatures" member value MUST be an array of JSON objects. Each object represents a
signature or MAC over the JWS Payload and the JWS Protected Header.
