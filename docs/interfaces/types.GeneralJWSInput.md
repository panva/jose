# Interface: GeneralJWSInput

[💗 Help the project](https://github.com/sponsors/panva)

General JWS definition for verify function inputs, allows payload as Uint8Array for detached
signature validation.

## Table of contents

### Properties

- [payload](types.GeneralJWSInput.md#payload)
- [signatures](types.GeneralJWSInput.md#signatures)

## Properties

### payload

• **payload**: `string` \| [`Uint8Array`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

The "payload" member MUST be present and contain the value BASE64URL(JWS Payload). When RFC7797
"b64": false is used the value passed may also be a Uint8Array.

___

### signatures

• **signatures**: [`Omit`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys )<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]

The "signatures" member value MUST be an array of JSON objects. Each object represents a
signature or MAC over the JWS Payload and the JWS Protected Header.
