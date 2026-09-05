# Interface: JWTClaimValidationFailure

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Shared details of JWT claim or header validation failures.

[JWTExpired](../classes/JWTExpired.md) does not extend [JWTClaimValidationFailed](../classes/JWTClaimValidationFailed.md). Use
[JWTClaimValidationError](../type-aliases/JWTClaimValidationError.md) or the [code](../classes/JOSEError.md#code) discriminant to handle both.

## Properties

### claim

• **claim**: `string`

Claim or header that failed validation.

***

### payload

• **payload**: [`JWTPayload`](../../../types/interfaces/JWTPayload.md)

The parsed JWT Claims Set; validation of other claims may be incomplete.

***

### reason

• **reason**: `string`

Reason code for the validation failure.
