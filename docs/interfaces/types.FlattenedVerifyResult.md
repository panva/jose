# Interface: FlattenedVerifyResult

[types](../modules/types.md).FlattenedVerifyResult

## Hierarchy

- **`FlattenedVerifyResult`**

  ↳ [`GeneralVerifyResult`](types.GeneralVerifyResult.md)

## Table of contents

### Properties

- [payload](types.FlattenedVerifyResult.md#payload)
- [protectedHeader](types.FlattenedVerifyResult.md#protectedheader)
- [unprotectedHeader](types.FlattenedVerifyResult.md#unprotectedheader)

## Properties

### payload

• **payload**: `Uint8Array`

JWS Payload.

#### Defined in

[types.d.ts:645](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L645)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Protected Header.

#### Defined in

[types.d.ts:650](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L650)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Unprotected Header.

#### Defined in

[types.d.ts:655](https://github.com/panva/jose/blob/v3.15.5/src/types.d.ts#L655)
