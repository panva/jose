# Interface: JWK\_oct

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Convenience interface for oct JSON Web Keys

## Table of contents

### Properties

- [k](types.JWK_oct.md#k)
- [kty](types.JWK_oct.md#kty)
- [alg](types.JWK_oct.md#alg)
- [ext](types.JWK_oct.md#ext)
- [key\_ops](types.JWK_oct.md#key_ops)
- [kid](types.JWK_oct.md#kid)
- [use](types.JWK_oct.md#use)
- [x5c](types.JWK_oct.md#x5c)
- [x5t](types.JWK_oct.md#x5t)
- [x5t#S256](types.JWK_oct.md#x5t#s256)
- [x5u](types.JWK_oct.md#x5u)

## Properties

### k

• **k**: `string`

Oct JWK "k" (Key Value) Parameter

___

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
