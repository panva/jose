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

[types.d.ts:256](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L256)

___

### signatures

• **signatures**: `Omit`<[`FlattenedJWSInput`](types.FlattenedJWSInput.md), ``"payload"``\>[]

#### Defined in

[types.d.ts:257](https://github.com/panva/jose/blob/v3.19.0/src/types.d.ts#L257)
