# Interface: JWKParameters

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Generic JSON Web Key Parameters.

## Table of contents

### Properties

- [kty](types.JWKParameters.md#kty)
- [alg](types.JWKParameters.md#alg)
- [ext](types.JWKParameters.md#ext)
- [key\_ops](types.JWKParameters.md#key_ops)
- [kid](types.JWKParameters.md#kid)
- [use](types.JWKParameters.md#use)
- [x5c](types.JWKParameters.md#x5c)
- [x5t](types.JWKParameters.md#x5t)
- [x5t#S256](types.JWKParameters.md#x5t#s256)
- [x5u](types.JWKParameters.md#x5u)

## Properties

### kty

• **kty**: `string`

JWK "kty" (Key Type) Parameter

___

### alg

• `Optional` **alg**: `string`

JWK "alg" (Algorithm) Parameter

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
