# Interface: GeneralJWSInput

[types](../modules/types.md).GeneralJWSInput

General JWS definition for verify function inputs, allows payload as
Uint8Array for detached signature validation.

## Table of contents

### Properties

- [payload](types.generaljwsinput.md#payload)
- [signatures](types.generaljwsinput.md#signatures)

## Properties

### payload

• **payload**: *string* \| *Uint8Array*

The "payload" member MUST be present and contain the value
BASE64URL(JWS Payload). When RFC7797 "b64": false is used
the value passed may also be a Uint8Array.

Defined in: [types.d.ts:144](https://github.com/panva/jose/blob/v3.11.1/src/types.d.ts#L144)

___

### signatures

• **signatures**: *Omit*<[*FlattenedJWSInput*](types.flattenedjwsinput.md), *payload*\>[]

The "signatures" member value MUST be an array of JSON objects.
Each object represents a signature or MAC over the JWS Payload and
the JWS Protected Header.

Defined in: [types.d.ts:151](https://github.com/panva/jose/blob/v3.11.1/src/types.d.ts#L151)
