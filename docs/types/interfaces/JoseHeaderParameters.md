# Interface: JoseHeaderParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

Header Parameters common to JWE and JWS.

## Properties

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
