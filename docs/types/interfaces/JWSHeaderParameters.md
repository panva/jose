# Interface: JWSHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Recognized JWS Header Parameters; additional members may also be present.

## Indexable

> \[`propName`: `string`\]: `unknown`

Any other JWS Header member.

## Properties

### alg?

• `optional` **alg?**: `string`

JWS "alg" (Algorithm) Header Parameter

#### See

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210#jws-alg)

***

### b64?

• `optional` **b64?**: `boolean`

Controls payload encoding and the JWS signing input as defined by
[RFC7797](https://www.rfc-editor.org/info/rfc7797/). Set to `false` and list `b64` in
`crit` to use an unencoded payload.

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
