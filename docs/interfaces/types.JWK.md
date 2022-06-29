# Interface: JWK

[💗 Help the project](https://github.com/sponsors/panva)

JSON Web Key ([JWK](https://www.rfc-editor.org/rfc/rfc7517)). "RSA", "EC", "OKP", and "oct" key
types are supported.

## Table of contents

### Properties

- [alg](types.JWK.md#alg)
- [crv](types.JWK.md#crv)
- [d](types.JWK.md#d)
- [dp](types.JWK.md#dp)
- [dq](types.JWK.md#dq)
- [e](types.JWK.md#e)
- [ext](types.JWK.md#ext)
- [k](types.JWK.md#k)
- [key\_ops](types.JWK.md#key_ops)
- [kid](types.JWK.md#kid)
- [kty](types.JWK.md#kty)
- [n](types.JWK.md#n)
- [oth](types.JWK.md#oth)
- [p](types.JWK.md#p)
- [q](types.JWK.md#q)
- [qi](types.JWK.md#qi)
- [use](types.JWK.md#use)
- [x](types.JWK.md#x)
- [x5c](types.JWK.md#x5c)
- [x5t](types.JWK.md#x5t)
- [x5t#S256](types.JWK.md#x5t#s256)
- [x5u](types.JWK.md#x5u)
- [y](types.JWK.md#y)

## Properties

### alg

• `Optional` **alg**: `string`

JWK "alg" (Algorithm) Parameter.

___

### crv

• `Optional` **crv**: `string`

___

### d

• `Optional` **d**: `string`

___

### dp

• `Optional` **dp**: `string`

___

### dq

• `Optional` **dq**: `string`

___

### e

• `Optional` **e**: `string`

___

### ext

• `Optional` **ext**: `boolean`

JWK "ext" (Extractable) Parameter.

___

### k

• `Optional` **k**: `string`

___

### key\_ops

• `Optional` **key\_ops**: `string`[]

JWK "key_ops" (Key Operations) Parameter.

___

### kid

• `Optional` **kid**: `string`

JWK "kid" (Key ID) Parameter.

___

### kty

• `Optional` **kty**: `string`

JWK "kty" (Key Type) Parameter.

___

### n

• `Optional` **n**: `string`

___

### oth

• `Optional` **oth**: { `d?`: `string` ; `r?`: `string` ; `t?`: `string`  }[]

___

### p

• `Optional` **p**: `string`

___

### q

• `Optional` **q**: `string`

___

### qi

• `Optional` **qi**: `string`

___

### use

• `Optional` **use**: `string`

JWK "use" (Public Key Use) Parameter.

___

### x

• `Optional` **x**: `string`

___

### x5c

• `Optional` **x5c**: `string`[]

JWK "x5c" (X.509 Certificate Chain) Parameter.

___

### x5t

• `Optional` **x5t**: `string`

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.

___

### x5t#S256

• `Optional` **x5t#S256**: `string`

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.

___

### x5u

• `Optional` **x5u**: `string`

JWK "x5u" (X.509 URL) Parameter.

___

### y

• `Optional` **y**: `string`
