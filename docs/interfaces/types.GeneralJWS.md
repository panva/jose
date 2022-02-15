# Interface: GeneralJWS

General JWS definition. Payload is returned as an empty
string when JWS Unencoded Payload Option
[RFC7797](https://www.rfc-editor.org/rfc/rfc7797) is used.

## Table of contents

### Properties

- [payload](types.GeneralJWS.md#payload)
- [signatures](types.GeneralJWS.md#signatures)

## Properties

### payload

• **payload**: `string`

___

### signatures

• **signatures**: `Omit`<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]
