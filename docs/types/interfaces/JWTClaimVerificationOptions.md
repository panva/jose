# Interface: JWTClaimVerificationOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JWT Claims Set verification options.

## Properties

### audience?

• `optional` **audience**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s).

This option makes the JWT "aud" (Audience) Claim presence required.

***

### clockTolerance?

• `optional` **clockTolerance**: `string` \| `number`

Clock skew tolerance

- In seconds when number (e.g. 5)
- Parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

Used when validating the JWT "nbf" (Not Before) and "exp" (Expiration Time) claims, and when
validating the "iat" (Issued At) claim if the maxTokenAge option is set.

***

### currentDate?

• `optional` **currentDate**: [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Date to use when comparing NumericDate claims, defaults to `new Date()`.

***

### issuer?

• `optional` **issuer**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s).

This option makes the JWT "iss" (Issuer) Claim presence required.

***

### maxTokenAge?

• `optional` **maxTokenAge**: `string` \| `number`

Maximum time elapsed (in seconds) from the JWT "iat" (Issued At) Claim value.

- In seconds when number (e.g. 5)
- Parsed as seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours").

This option makes the JWT "iat" (Issued At) Claim presence required.

***

### requiredClaims?

• `optional` **requiredClaims**: `string`[]

Array of required Claim Names that must be present in the JWT Claims Set. Default is that: if
the [`issuer` option](JWTClaimVerificationOptions.md#issuer) is set, then JWT "iss" (Issuer)
Claim must be present; if the [`audience` option](JWTClaimVerificationOptions.md#audience) is
set, then JWT "aud" (Audience) Claim must be present; if the
[`subject` option](JWTClaimVerificationOptions.md#subject) is set, then JWT "sub" (Subject)
Claim must be present; if the
[`maxTokenAge` option](JWTClaimVerificationOptions.md#maxtokenage) is set, then JWT "iat"
(Issued At) Claim must be present.

***

### subject?

• `optional` **subject**: `string`

Expected JWT "sub" (Subject) Claim value.

This option makes the JWT "sub" (Subject) Claim presence required.

***

### typ?

• `optional` **typ**: `string`

Expected JWT "typ" (Type) Header Parameter value.

This option makes the JWT "typ" (Type) Header Parameter presence required.
