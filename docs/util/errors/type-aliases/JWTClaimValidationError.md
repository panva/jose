# Type Alias: JWTClaimValidationError

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **JWTClaimValidationError** = [`JWTClaimValidationFailed`](../classes/JWTClaimValidationFailed.md) \| [`JWTExpired`](../classes/JWTExpired.md)

Errors thrown during JWT Claims Set validation.

[JWTExpired](../classes/JWTExpired.md) does not extend [JWTClaimValidationFailed](../classes/JWTClaimValidationFailed.md), so a single `instanceof` check
cannot cover both. Use this type together with the [code](../classes/JOSEError.md#code) discriminant when
handling either.

## Example

```ts
function isClaimValidationError(err: unknown): err is jose.errors.JWTClaimValidationError {
  return (
    err instanceof jose.errors.JWTClaimValidationFailed ||
    err instanceof jose.errors.JWTExpired
  )
}
```
