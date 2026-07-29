# Interface: JWTVerifyOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Combination of JWS Verification options and JWT Claims Set verification options.

## Properties

### algorithms?

• `optional` **algorithms?**: `string`[]

A list of accepted JWS "alg" (Algorithm) Header Parameter values. By default all "alg"
(Algorithm) values applicable for the used key/secret are allowed.

> [!NOTE]\
> Unsecured JWTs (`{ "alg": "none" }`) are never accepted by this API.

***

### audience?

• `optional` **audience?**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s). This option makes the JWT "aud" (Audience) Claim
presence required.

***

### clockTolerance?

• `optional` **clockTolerance?**: `string` \| `number`

Clock skew tolerance in seconds when a number (e.g. 5), or resolved into seconds when a string
(e.g. "5 seconds", "10 minutes", "2 hours"). Used when validating the JWT "nbf" (Not Before)
and "exp" (Expiration Time) claims, and when validating the "iat" (Issued At) claim if the
[`maxTokenAge` option](../../../types/interfaces/JWTClaimVerificationOptions.md#maxtokenage) is set.

***

### crit?

• `optional` **crit?**: `object`

An object with keys representing recognized "crit" (Critical) Header Parameter names. The value
for those is either `true` or `false`. `true` when the Header Parameter MUST be integrity
protected, `false` when it's irrelevant. The JWS extension Header Parameter `b64` is always
recognized and processed properly; no other registered Header Parameters currently receive this
built-in treatment.

> [!WARNING]\
> This only checks that the Header Parameter is syntactically correct when provided and,
> optionally, integrity protected. It does not process the Header Parameter or reject the
> operation when it is missing. You MUST still verify its presence and process it according to
> the profile's validation steps after the operation succeeds.

#### Index Signature

\[`propName`: `string`\]: `boolean`

***

### currentDate?

• `optional` **currentDate?**: [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Date to use when comparing NumericDate claims, defaults to `new Date()`.

***

### issuer?

• `optional` **issuer?**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s). This option makes the JWT "iss" (Issuer) Claim
presence required.

***

### maxTokenAge?

• `optional` **maxTokenAge?**: `string` \| `number`

Maximum time elapsed from the JWT "iat" (Issued At) Claim value, in seconds when a number (e.g.
5), or resolved into seconds when a string (e.g. "5 seconds", "10 minutes", "2 hours"). This
option makes the JWT "iat" (Issued At) Claim presence required.

***

### requiredClaims?

• `optional` **requiredClaims?**: `string`[]

Array of required Claim Names that must be present in the JWT Claims Set. Default is that: if
the [`issuer` option](../../../types/interfaces/JWTClaimVerificationOptions.md#issuer) is set, then JWT "iss" (Issuer) Claim must be present; if the
[`audience` option](../../../types/interfaces/JWTClaimVerificationOptions.md#audience) is set, then JWT "aud" (Audience) Claim must be present; if
the [`subject` option](../../../types/interfaces/JWTClaimVerificationOptions.md#subject) is set, then JWT "sub" (Subject) Claim must be present; if
the [`maxTokenAge` option](../../../types/interfaces/JWTClaimVerificationOptions.md#maxtokenage) is set, then JWT "iat" (Issued At) Claim must be
present.

***

### subject?

• `optional` **subject?**: `string`

Expected JWT "sub" (Subject) Claim value. This option makes the JWT "sub" (Subject) Claim
presence required.

***

### typ?

• `optional` **typ?**: `string`

Expected JWT "typ" (Type) Header Parameter value. This option makes the JWT "typ" (Type) Header
Parameter presence required.
