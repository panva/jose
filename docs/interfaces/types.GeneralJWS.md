# Interface: GeneralJWS

[types](../modules/types.md).GeneralJWS

General JWS definition. Payload is an optional return property, it
is not returned when JWS Unencoded Payload Option
[RFC7797](https://tools.ietf.org/html/rfc7797) is used.

## Table of contents

### Properties

- [payload](types.GeneralJWS.md#payload)
- [signatures](types.GeneralJWS.md#signatures)

## Properties

### payload

• `Optional` **payload**: `string`

#### Defined in

[types.d.ts:228](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L228)

___

### signatures

• **signatures**: `Omit`<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]

#### Defined in

[types.d.ts:229](https://github.com/panva/jose/blob/v3.14.3/src/types.d.ts#L229)
