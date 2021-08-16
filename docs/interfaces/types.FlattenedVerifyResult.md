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

[types.d.ts:646](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L646)

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Protected Header.

#### Defined in

[types.d.ts:651](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L651)

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Unprotected Header.

#### Defined in

[types.d.ts:656](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L656)
