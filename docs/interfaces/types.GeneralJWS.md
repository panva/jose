# Interface: GeneralJWS

[types](../modules/types.md).GeneralJWS

General JWS definition. Payload is returned as an empty
string when JWS Unencoded Payload Option
[RFC7797](https://tools.ietf.org/html/rfc7797) is used.

## Table of contents

### Properties

- [payload](types.GeneralJWS.md#payload)
- [signatures](types.GeneralJWS.md#signatures)

## Properties

### payload

• **payload**: `string`

#### Defined in

[types.d.ts:227](https://github.com/panva/jose/blob/v3.15.4/src/types.d.ts#L227)

___

### signatures

• **signatures**: `Omit`<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]

#### Defined in

[types.d.ts:228](https://github.com/panva/jose/blob/v3.15.4/src/types.d.ts#L228)
