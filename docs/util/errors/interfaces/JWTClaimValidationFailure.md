# Interface: JWTClaimValidationFailure

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Shared properties of JWT Claims Set validation errors.

> [!NOTE]\
> [JWTExpired](../classes/JWTExpired.md) does not extend [JWTClaimValidationFailed](../classes/JWTClaimValidationFailed.md), so `instanceof
> JWTClaimValidationFailed` is `false` for an expired JWT. Use [JWTClaimValidationError](../type-aliases/JWTClaimValidationError.md) or
> the [code](../classes/JOSEError.md#code) discriminant to handle both.

## Properties

### claim

• **claim**: `string`

The Claim for which the validation failed.

***

### payload

• **payload**: [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

The parsed JWT Claims Set (aka payload).

***

### reason

• **reason**: `string`

Reason code for the validation failure.
