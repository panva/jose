# Interface: GeneralJWS

General JWS definition. Payload is an optional return property, it
is not returned when JWS Unencoded Payload Option
[RFC7797](https://tools.ietf.org/html/rfc7797) is used.

## Index

### Properties

* [payload](_types_d_.generaljws.md#payload)
* [signatures](_types_d_.generaljws.md#signatures)

## Properties

### payload

• `Optional` **payload**: string

*Defined in [src/types.d.ts:170](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L170)*

___

### signatures

•  **signatures**: Omit<[FlattenedJWSInput](_types_d_.flattenedjwsinput.md), \"payload\"\>[]

*Defined in [src/types.d.ts:171](https://github.com/panva/jose/blob/v3.5.4/src/types.d.ts#L171)*
