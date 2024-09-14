# Interface: JWK\_RSA\_Private

## [💗 Help the project](https://github.com/sponsors/panva)

Support from the community to continue maintaining and improving this module is welcome. If you find the module useful, please consider supporting the project by [becoming a sponsor](https://github.com/sponsors/panva).

---

Convenience interface for Private RSA JSON Web Keys

## Table of contents

### Properties

- [d](types.JWK_RSA_Private.md#d)
- [dp](types.JWK_RSA_Private.md#dp)
- [dq](types.JWK_RSA_Private.md#dq)
- [e](types.JWK_RSA_Private.md#e)
- [kty](types.JWK_RSA_Private.md#kty)
- [n](types.JWK_RSA_Private.md#n)
- [p](types.JWK_RSA_Private.md#p)
- [q](types.JWK_RSA_Private.md#q)
- [qi](types.JWK_RSA_Private.md#qi)
- [alg](types.JWK_RSA_Private.md#alg)
- [ext](types.JWK_RSA_Private.md#ext)
- [key\_ops](types.JWK_RSA_Private.md#key_ops)
- [kid](types.JWK_RSA_Private.md#kid)
- [oth](types.JWK_RSA_Private.md#oth)
- [use](types.JWK_RSA_Private.md#use)
- [x5c](types.JWK_RSA_Private.md#x5c)
- [x5t](types.JWK_RSA_Private.md#x5t)
- [x5t#S256](types.JWK_RSA_Private.md#x5t#s256)
- [x5u](types.JWK_RSA_Private.md#x5u)

## Properties

### d

• **d**: `string`

RSA JWK "d" (Private Exponent) Parameter

___

### dp

• **dp**: `string`

RSA JWK "dp" (First Factor CRT Exponent) Parameter

___

### dq

• **dq**: `string`

RSA JWK "dq" (Second Factor CRT Exponent) Parameter

___

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

### p

• **p**: `string`

RSA JWK "p" (First Prime Factor) Parameter

___

### q

• **q**: `string`

RSA JWK "q" (Second Prime Factor) Parameter

___

### qi

• **qi**: `string`

RSA JWK "qi" (First CRT Coefficient) Parameter

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

### oth

• `Optional` **oth**: \{ `d?`: `string` ; `r?`: `string` ; `t?`: `string`  }[]

RSA JWK "oth" (Other Primes Info) Parameter

This parameter is not supported

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
