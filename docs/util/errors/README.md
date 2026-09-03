# util/errors

JOSE module errors and error codes

These are exported (as the `errors` namespace) from the main `'jose'` module entry point as well
as from the subpath export `'jose/errors'`.

## Classes

| Class | Description |
| ------ | ------ |
| [JOSEAlgNotAllowed](classes/JOSEAlgNotAllowed.md) | An error subclass thrown when a JOSE Algorithm is not allowed per developer preference. |
| [JOSEError](classes/JOSEError.md) | A generic Error that all other JOSE specific Error subclasses extend. |
| [JOSENotSupported](classes/JOSENotSupported.md) | An error subclass thrown when a particular feature or algorithm is not supported by this implementation or JOSE in general. |
| [JWEDecryptionFailed](classes/JWEDecryptionFailed.md) | An error subclass thrown when a JWE ciphertext decryption fails. |
| [JWEInvalid](classes/JWEInvalid.md) | An error subclass thrown when a JWE is invalid. |
| [JWKInvalid](classes/JWKInvalid.md) | An error subclass thrown when a JWK is invalid. |
| [JWKSInvalid](classes/JWKSInvalid.md) | An error subclass thrown when a JWKS is invalid. |
| [JWKSMultipleMatchingKeys](classes/JWKSMultipleMatchingKeys.md) | An error subclass thrown when multiple keys match from a JWKS. |
| [JWKSNoMatchingKey](classes/JWKSNoMatchingKey.md) | An error subclass thrown when no keys match from a JWKS. |
| [JWKSTimeout](classes/JWKSTimeout.md) | Timeout was reached when retrieving the JWKS response. |
| [JWSInvalid](classes/JWSInvalid.md) | An error subclass thrown when a JWS is invalid. |
| [JWSSignatureVerificationFailed](classes/JWSSignatureVerificationFailed.md) | An error subclass thrown when JWS signature verification fails. |
| [JWTClaimValidationFailed](classes/JWTClaimValidationFailed.md) | An error subclass thrown when a JWT Claim Set member validation fails. |
| [JWTExpired](classes/JWTExpired.md) | An error subclass thrown when a JWT is expired. |
| [JWTInvalid](classes/JWTInvalid.md) | An error subclass thrown when a JWT is invalid. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTClaimValidationFailure](interfaces/JWTClaimValidationFailure.md) | The shape shared by the two errors thrown during JWT Claims Set validation. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AnyJOSEError](type-aliases/AnyJOSEError.md) | Union of every [JOSEError](classes/JOSEError.md) subclass this module throws, each paired with the single [JOSEErrorCode](type-aliases/JOSEErrorCode.md) it is thrown with. That pairing lives here rather than on the classes, so that `code` stays assignable, writable, and overridable on them exactly as before, while a value of this type can still be switched over as a discriminated union. |
| [JOSEErrorCode](type-aliases/JOSEErrorCode.md) | Every stable error code used by this module. [AnyJOSEError](type-aliases/AnyJOSEError.md) pairs each subclass with the one it is thrown with, making that union a discriminated one. |
| [JWTClaimValidationError](type-aliases/JWTClaimValidationError.md) | Union of the errors thrown during JWT Claims Set validation. [JWTExpired](classes/JWTExpired.md) does not extend [JWTClaimValidationFailed](classes/JWTClaimValidationFailed.md), so a single `instanceof` check cannot cover both. Use this type — together with the [code](classes/JOSEError.md#code) discriminant — when handling either. |
