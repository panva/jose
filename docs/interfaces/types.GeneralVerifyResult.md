# Interface: GeneralVerifyResult

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

## Table of contents

### Properties

- [payload](types.GeneralVerifyResult.md#payload)
- [protectedHeader](types.GeneralVerifyResult.md#protectedheader)
- [unprotectedHeader](types.GeneralVerifyResult.md#unprotectedheader)

## Properties

### payload

• **payload**: [`Uint8Array`]( https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array )

JWS Payload.

___

### protectedHeader

• `Optional` **protectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Protected Header.

___

### unprotectedHeader

• `Optional` **unprotectedHeader**: [`JWSHeaderParameters`](types.JWSHeaderParameters.md)

JWS Unprotected Header.
