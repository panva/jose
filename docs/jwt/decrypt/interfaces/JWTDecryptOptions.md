# Interface: JWTDecryptOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

JWE decryption and JWT Claims Set validation options.

## Properties

### audience?

• `optional` **audience?**: `string` \| `string`[]

Expected JWT "aud" (Audience) Claim value(s). Requires the claim to be present.

***

### clockTolerance?

• `optional` **clockTolerance?**: `string` \| `number`

Clock skew tolerance in seconds or a duration string (e.g. "5 seconds"). Applies to the "nbf"
(Not Before) and "exp" (Expiration Time) claims, and to "iat" (Issued At) when
[maxTokenAge](../../../types/interfaces/JWTClaimVerificationOptions.md#maxtokenage) is set.

***

### contentEncryptionAlgorithms?

• `optional` **contentEncryptionAlgorithms?**: `string`[]

Accepted JWE "enc" (Encryption Algorithm) Header Parameter values. Defaults to all algorithms
applicable to the key or secret.

***

### crit?

• `optional` **crit?**: `object`

Recognized "crit" (Critical) Header Parameter names. Set each value to `true` to require
integrity protection, or `false` when protection is optional. The JWS `b64` extension is always
recognized and processed.

> [!WARNING]\
> Other extensions are only checked for syntax and optional integrity protection. Their presence
> is not required by this option. You must check their presence and process them according to the
> profile's validation steps after the operation succeeds.

#### Index Signature

\[`propName`: `string`\]: `boolean`

***

### currentDate?

• `optional` **currentDate?**: [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Date for NumericDate comparisons. Defaults to `new Date()`.

***

### issuer?

• `optional` **issuer?**: `string` \| `string`[]

Expected JWT "iss" (Issuer) Claim value(s). Requires the claim to be present.

***

### keyManagementAlgorithms?

• `optional` **keyManagementAlgorithms?**: `string`[]

Accepted JWE "alg" (Algorithm) Header Parameter values. Defaults to all algorithms applicable
to the key or secret except PBES2, which must be explicitly allowed.

***

### maxDecompressedLength?

• `optional` **maxDecompressedLength?**: `number`

Maximum decompressed plaintext size in bytes. Defaults to 250000; `0` rejects compressed JWEs,
and `Infinity` disables the limit. Other values must be positive safe integers.

***

### maxPBES2Count?

• `optional` **maxPBES2Count?**: `number`

Maximum "p2c" (PBES2 Count) Header Parameter value, limiting PBKDF2 iterations and their
computational expense. Defaults to 10000; must be a positive safe integer or `Infinity` to
disable the limit.

***

### maxTokenAge?

• `optional` **maxTokenAge?**: `string` \| `number`

Maximum time since the JWT "iat" (Issued At) Claim, in seconds or a duration string (e.g. "2
hours"). Requires the claim to be present.

***

### requiredClaims?

• `optional` **requiredClaims?**: `string`[]

Additional claim names required in the JWT Claims Set. The [issuer](../../../types/interfaces/JWTClaimVerificationOptions.md#issuer), [audience](../../../types/interfaces/JWTClaimVerificationOptions.md#audience),
[subject](../../../types/interfaces/JWTClaimVerificationOptions.md#subject), and [maxTokenAge](../../../types/interfaces/JWTClaimVerificationOptions.md#maxtokenage) options independently require "iss", "aud", "sub", and
"iat", respectively.

***

### subject?

• `optional` **subject?**: `string`

Expected JWT "sub" (Subject) Claim value. Requires the claim to be present.

***

### typ?

• `optional` **typ?**: `string`

Expected JWT "typ" (Type) Header Parameter value. Requires the parameter to be present.
