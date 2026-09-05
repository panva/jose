# Type Alias: AnyJOSEError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **AnyJOSEError** = [`JOSEAlgNotAllowed`](../classes/JOSEAlgNotAllowed.md) \| [`JOSENotSupported`](../classes/JOSENotSupported.md) \| [`JWEDecryptionFailed`](../classes/JWEDecryptionFailed.md) \| [`JWEInvalid`](../classes/JWEInvalid.md) \| [`JWKInvalid`](../classes/JWKInvalid.md) \| [`JWKSInvalid`](../classes/JWKSInvalid.md) \| [`JWKSMultipleMatchingKeys`](../classes/JWKSMultipleMatchingKeys.md) \| [`JWKSNoMatchingKey`](../classes/JWKSNoMatchingKey.md) \| [`JWKSTimeout`](../classes/JWKSTimeout.md) \| [`JWSInvalid`](../classes/JWSInvalid.md) \| [`JWSSignatureVerificationFailed`](../classes/JWSSignatureVerificationFailed.md) \| [`JWTClaimValidationFailed`](../classes/JWTClaimValidationFailed.md) \| [`JWTExpired`](../classes/JWTExpired.md) \| [`JWTInvalid`](../classes/JWTInvalid.md)

Discriminated union of specific [JOSEError](../classes/JOSEError.md) subclasses, narrowed by `code`. Excludes base
[JOSEError](../classes/JOSEError.md) instances; use `instanceof JOSEError` to catch all module errors.

Each subclass is paired with its [JOSEErrorCode](JOSEErrorCode.md). That pairing lives here rather than on the
classes, so `code` stays assignable, writable, and overridable while values of this type can be
narrowed by their error code.

Some JWKS HTTP failures use the base [JOSEError](../classes/JOSEError.md) class. This union is for values already
known to be one of the specific subclasses.
