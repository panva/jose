# Type Alias: AnyJOSEError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **AnyJOSEError** = [`JOSEAlgNotAllowed`](../classes/JOSEAlgNotAllowed.md) \| [`JOSENotSupported`](../classes/JOSENotSupported.md) \| [`JWEDecryptionFailed`](../classes/JWEDecryptionFailed.md) \| [`JWEInvalid`](../classes/JWEInvalid.md) \| [`JWKInvalid`](../classes/JWKInvalid.md) \| [`JWKSInvalid`](../classes/JWKSInvalid.md) \| [`JWKSMultipleMatchingKeys`](../classes/JWKSMultipleMatchingKeys.md) \| [`JWKSNoMatchingKey`](../classes/JWKSNoMatchingKey.md) \| [`JWKSTimeout`](../classes/JWKSTimeout.md) \| [`JWSInvalid`](../classes/JWSInvalid.md) \| [`JWSSignatureVerificationFailed`](../classes/JWSSignatureVerificationFailed.md) \| [`JWTClaimValidationFailed`](../classes/JWTClaimValidationFailed.md) \| [`JWTExpired`](../classes/JWTExpired.md) \| [`JWTInvalid`](../classes/JWTInvalid.md)

Union of every [JOSEError](../classes/JOSEError.md) subclass this module throws, each paired with the single
[JOSEErrorCode](JOSEErrorCode.md) it is thrown with. That pairing lives here rather than on the classes, so
that `code` stays assignable, writable, and overridable on them exactly as before, while a value
of this type can still be switched over as a discriminated union.

> [!NOTE]\
> The base [JOSEError](../classes/JOSEError.md) is deliberately not a member — its `code` spans every value, which
> would defeat the discriminant. A small number of JSON Web Key Set HTTP failures are thrown as the
> base class itself, so `instanceof JOSEError` remains the catch-all; this union is for handling a
> value already known to be one of the specific errors.
