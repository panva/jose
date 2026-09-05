# util/errors

JOSE module errors and error codes

These are exported (as the `errors` namespace) from the main `'jose'` module entry point as well
as from the subpath export `'jose/errors'`.

## Classes

| Class | Description |
| ------ | ------ |
| [JOSEAlgNotAllowed](classes/JOSEAlgNotAllowed.md) | Thrown when an algorithm is disallowed by configuration. |
| [JOSEError](classes/JOSEError.md) | Base class for JOSE errors. |
| [JOSENotSupported](classes/JOSENotSupported.md) | Thrown when a feature or algorithm is unsupported. |
| [JWEDecryptionFailed](classes/JWEDecryptionFailed.md) | Thrown when JWE ciphertext decryption or authentication fails. |
| [JWEInvalid](classes/JWEInvalid.md) | Thrown when a JWE is invalid. |
| [JWKInvalid](classes/JWKInvalid.md) | Thrown when a JWK is invalid. |
| [JWKSInvalid](classes/JWKSInvalid.md) | Thrown when a JWKS is invalid. |
| [JWKSMultipleMatchingKeys](classes/JWKSMultipleMatchingKeys.md) | Thrown when multiple keys match in a JWKS. |
| [JWKSNoMatchingKey](classes/JWKSNoMatchingKey.md) | Thrown when no keys match in a JWKS. |
| [JWKSTimeout](classes/JWKSTimeout.md) | Thrown when fetching a remote JWKS times out. |
| [JWSInvalid](classes/JWSInvalid.md) | Thrown when a JWS is invalid. |
| [JWSSignatureVerificationFailed](classes/JWSSignatureVerificationFailed.md) | Thrown when JWS signature verification fails. |
| [JWTClaimValidationFailed](classes/JWTClaimValidationFailed.md) | Thrown when JWT claim or header validation fails. Expiration is reported separately as [JWTExpired](classes/JWTExpired.md). |
| [JWTExpired](classes/JWTExpired.md) | Thrown when a JWT has expired or exceeds the configured maximum token age. |
| [JWTInvalid](classes/JWTInvalid.md) | Thrown when a JWT is invalid. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [JWTClaimValidationFailure](interfaces/JWTClaimValidationFailure.md) | Shared details of JWT claim or header validation failures. |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [AnyJOSEError](type-aliases/AnyJOSEError.md) | Discriminated union of specific [JOSEError](classes/JOSEError.md) subclasses, narrowed by `code`. Excludes base [JOSEError](classes/JOSEError.md) instances; use `instanceof JOSEError` to catch all module errors. |
| [JOSEErrorCode](type-aliases/JOSEErrorCode.md) | Stable error codes used by this module. |
| [JWTClaimValidationError](type-aliases/JWTClaimValidationError.md) | Errors thrown during JWT Claims Set validation. |
