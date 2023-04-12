# Interface: GeneralJWS

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

General JWS definition. Payload is returned as an empty string when JWS Unencoded Payload
([RFC7797](https://www.rfc-editor.org/rfc/rfc7797)) is used.

## Table of contents

### Properties

- [payload](types.GeneralJWS.md#payload)
- [signatures](types.GeneralJWS.md#signatures)

## Properties

### payload

• **payload**: `string`

___

### signatures

• **signatures**: [`Omit`]( https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys )<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]
