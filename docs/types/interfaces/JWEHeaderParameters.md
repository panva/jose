# Interface: JWEHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWE Header Parameters, any other Header members may also be present.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWE Header member.

## Properties

### alg?

• `optional` **alg?**: `string`

JWE "alg" (Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg)

***

### crit?

• `optional` **crit?**: `string`[]

JWE "crit" (Critical) Header Parameter

***

### cty?

• `optional` **cty?**: `string`

"cty" (Content Type) Header Parameter

***

### enc?

• `optional` **enc?**: `string`

JWE "enc" (Encryption Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jwe-alg)

***

### jku?

• `optional` **jku?**: `string`

"jku" (JWK Set URL) Header Parameter

***

### jwk?

• `optional` **jwk?**: [`Pick`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)\<[`JWK`](JWK.md), `"x"` \| `"y"` \| `"crv"` \| `"e"` \| `"n"` \| `"pub"` \| `"kty"` \| `"alg"`\>

"jwk" (JSON Web Key) Header Parameter

***

### kid?

• `optional` **kid?**: `string`

"kid" (Key ID) Header Parameter

***

### psk\_id?

• `optional` **psk\_id**: `string`

HPKE Pre-Shared Key Identifier (PSK ID) for use in PSK mode.

***

### typ?

• `optional` **typ?**: `string`

"typ" (Type) Header Parameter

***

### x5c?

• `optional` **x5c?**: `string`[]

"x5c" (X.509 Certificate Chain) Header Parameter

***

### x5t?

• `optional` **x5t?**: `string`

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter

***

### x5u?

• `optional` **x5u?**: `string`

"x5u" (X.509 URL) Header Parameter

***

### zip?

• `optional` **zip?**: `string`

JWE "zip" (Compression Algorithm) Header Parameter.

The only supported value is `"DEF"` (DEFLATE). Requires the `CompressionStream` /
`DecompressionStream` APIs to be available in the runtime.

#### See

[JWE "zip" Header Parameter](https://www.rfc-editor.org/rfc/rfc7516#section-4.1.3)
