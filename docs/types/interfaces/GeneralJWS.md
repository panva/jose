# Interface: GeneralJWS

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

General JWS JSON Serialization Syntax token. Payload is returned as an empty string when JWS
Unencoded Payload ([RFC7797](https://www.rfc-editor.org/rfc/rfc7797)) is used.

## Properties

### payload

• **payload**: `string`

***

### signatures

• **signatures**: [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`FlattenedJWSInput`](FlattenedJWSInput.md), `"payload"`\>[]
