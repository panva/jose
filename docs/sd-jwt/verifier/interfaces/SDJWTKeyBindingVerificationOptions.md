# Interface: SDJWTKeyBindingVerificationOptions

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Verifier policy for mandatory RFC 9901 Key Binding.

## Properties

### algorithms

• **algorithms**: `string`[]

Allowed asymmetric JWS signature algorithms.

***

### audience

• **audience**: `string`

Expected single-valued Key Binding JWT audience.

***

### maxTokenAge

• **maxTokenAge**: `string` \| `number`

Maximum age of the Key Binding JWT. This is not a substitute for nonce replay protection.

***

### nonce

• **nonce**: `string`

Expected fresh transaction nonce. The application must securely issue and atomically consume
nonces; equality and age validation do not by themselves prevent replay.

***

### clockTolerance?

• `optional` **clockTolerance?**: `string` \| `number`

Clock skew tolerance used for `iat` validation.

***

### currentDate?

• `optional` **currentDate?**: [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)

Date to use for time validation. Defaults to the current time.

***

### getKey?

• `optional` **getKey?**: [`SDJWTHolderKeyResolver`](SDJWTHolderKeyResolver.md)

Resolver for confirmation methods other than `cnf.jwk`.
