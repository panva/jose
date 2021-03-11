# Interface: GeneralJWSInput

General JWS definition for verify function inputs, allows payload as
Uint8Array for detached signature validation.

## Index

### Properties

* [payload](_types_d_.generaljwsinput.md#payload)
* [signatures](_types_d_.generaljwsinput.md#signatures)

## Properties

### payload

•  **payload**: string \| Uint8Array

*Defined in [src/types.d.ts:144](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L144)*

The "payload" member MUST be present and contain the value
BASE64URL(JWS Payload). When RFC7797 "b64": false is used
the value passed may also be a Uint8Array.

___

### signatures

•  **signatures**: Omit<[FlattenedJWSInput](_types_d_.flattenedjwsinput.md), \"payload\"\>[]

*Defined in [src/types.d.ts:151](https://github.com/panva/jose/blob/v3.7.1/src/types.d.ts#L151)*

The "signatures" member value MUST be an array of JSON objects.
Each object represents a signature or MAC over the JWS Payload and
the JWS Protected Header.
