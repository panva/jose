# Interface: CompactJWEHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized Compact JWE Header Parameters; additional members may also be present.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWE Header member.

## Properties

### alg

• **alg**: `string`

JWE "alg" (Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg)

***

### enc

• **enc**: `string`

JWE "enc" (Encryption Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg)

***

### crit?

• `optional` **crit?**: `string`[]

Extension parameters that must be recognized.

***

### cty?

• `optional` **cty?**: `string`

Content type.

***

### jku?

• `optional` **jku?**: `string`

JWK Set URL.

***

### jwk?

• `optional` **jwk?**: [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)\<[`JWK`](../type-aliases/JWK.md), `"d"` \| `"p"` \| `"q"` \| `"k"` \| `"dp"` \| `"dq"` \| `"qi"` \| `"priv"` \| `"oth"`\>

Public JWK only; private and symmetric key parameters are not permitted.

***

### kid?

• `optional` **kid?**: `string`

"kid" (Key ID) Header Parameter

***

### typ?

• `optional` **typ?**: `string`

"typ" (Type) Header Parameter

***

### x5c?

• `optional` **x5c?**: `string`[]

X.509 certificate chain.

***

### x5t?

• `optional` **x5t?**: `string`

X.509 certificate SHA-1 thumbprint.

***

### x5u?

• `optional` **x5u?**: `string`

X.509 certificate URL.

***

### zip?

• `optional` **zip?**: `string`

JWE compression algorithm. Only `"DEF"` (DEFLATE) is supported, requiring the runtime's
`CompressionStream` / `DecompressionStream` APIs.

#### See

[JWE "zip" Header Parameter](https://www.rfc-editor.org/info/rfc7516/#section-4.1.3)
