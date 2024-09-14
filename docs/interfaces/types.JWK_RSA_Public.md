# Interface: JWK\_RSA\_Public

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Convenience interface for Public RSA JSON Web Keys

## Table of contents

### Properties

- [e](types.JWK_RSA_Public.md#e)
- [kty](types.JWK_RSA_Public.md#kty)
- [n](types.JWK_RSA_Public.md#n)
- [alg](types.JWK_RSA_Public.md#alg)
- [ext](types.JWK_RSA_Public.md#ext)
- [key\_ops](types.JWK_RSA_Public.md#key_ops)
- [kid](types.JWK_RSA_Public.md#kid)
- [use](types.JWK_RSA_Public.md#use)
- [x5c](types.JWK_RSA_Public.md#x5c)
- [x5t](types.JWK_RSA_Public.md#x5t)
- [x5t#S256](types.JWK_RSA_Public.md#x5t#s256)
- [x5u](types.JWK_RSA_Public.md#x5u)

## Properties

### e

• **e**: `string`

RSA JWK "e" (Exponent) Parameter

___

### kty

• **kty**: `string`

JWK "kty" (Key Type) Parameter

___

### n

• **n**: `string`

RSA JWK "n" (Modulus) Parameter

___

### alg

• `Optional` **alg**: `string`

JWK "alg" (Algorithm) Parameter

**`See`**

[Algorithm Key Requirements](https://github.com/panva/jose/issues/210)

___

### ext

• `Optional` **ext**: `boolean`

JWK "ext" (Extractable) Parameter

___

### key\_ops

• `Optional` **key\_ops**: `string`[]

JWK "key_ops" (Key Operations) Parameter

___

### kid

• `Optional` **kid**: `string`

JWK "kid" (Key ID) Parameter

___

### use

• `Optional` **use**: `string`

JWK "use" (Public Key Use) Parameter

___

### x5c

• `Optional` **x5c**: `string`[]

JWK "x5c" (X.509 Certificate Chain) Parameter

___

### x5t

• `Optional` **x5t**: `string`

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter

___

### x5t#S256

• `Optional` **x5t#S256**: `string`

JWK "x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter

___

### x5u

• `Optional` **x5u**: `string`

JWK "x5u" (X.509 URL) Parameter
