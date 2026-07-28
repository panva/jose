# Type Alias: JOSEErrorCode

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

• **JOSEErrorCode** = `"ERR_JOSE_ALG_NOT_ALLOWED"` \| `"ERR_JOSE_GENERIC"` \| `"ERR_JOSE_NOT_SUPPORTED"` \| `"ERR_JWE_DECRYPTION_FAILED"` \| `"ERR_JWE_INVALID"` \| `"ERR_JWK_INVALID"` \| `"ERR_JWKS_INVALID"` \| `"ERR_JWKS_MULTIPLE_MATCHING_KEYS"` \| `"ERR_JWKS_NO_MATCHING_KEY"` \| `"ERR_JWKS_TIMEOUT"` \| `"ERR_JWS_INVALID"` \| `"ERR_JWS_SIGNATURE_VERIFICATION_FAILED"` \| `"ERR_JWT_CLAIM_VALIDATION_FAILED"` \| `"ERR_JWT_EXPIRED"` \| `"ERR_JWT_INVALID"`

Every stable error code used by this module. [AnyJOSEError](AnyJOSEError.md) pairs each subclass with the one
it is thrown with, making that union a discriminated one.

## Example

```ts
function handle(err: jose.errors.AnyJOSEError) {
  switch (err.code) {
    case 'ERR_JWT_EXPIRED':
      console.log(err.payload) // narrowed to JWTExpired
      break
    case 'ERR_JWKS_MULTIPLE_MATCHING_KEYS':
      break
  }
}
```
