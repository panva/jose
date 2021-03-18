# Interface: JWK

[types](../modules/types.md).JWK

JSON Web Key ([JWK](https://tools.ietf.org/html/rfc7517)).
"RSA", "EC", "OKP", and "oct" key types are supported.

## Table of contents

### Properties

- [alg](types.jwk.md#alg)
- [crv](types.jwk.md#crv)
- [d](types.jwk.md#d)
- [dp](types.jwk.md#dp)
- [dq](types.jwk.md#dq)
- [e](types.jwk.md#e)
- [ext](types.jwk.md#ext)
- [k](types.jwk.md#k)
- [key\_ops](types.jwk.md#key_ops)
- [kid](types.jwk.md#kid)
- [kty](types.jwk.md#kty)
- [n](types.jwk.md#n)
- [oth](types.jwk.md#oth)
- [p](types.jwk.md#p)
- [q](types.jwk.md#q)
- [qi](types.jwk.md#qi)
- [use](types.jwk.md#use)
- [x](types.jwk.md#x)
- [x5c](types.jwk.md#x5c)
- [x5t](types.jwk.md#x5t)
- [x5t#S256](types.jwk.md#x5t#s256)
- [x5u](types.jwk.md#x5u)
- [y](types.jwk.md#y)

## Properties

### alg

• `Optional` **alg**: *string*

JWK "alg" (Algorithm) Parameter.

Defined in: [types.d.ts:14](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L14)

___

### crv

• `Optional` **crv**: *string*

Defined in: [types.d.ts:15](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L15)

___

### d

• `Optional` **d**: *string*

Defined in: [types.d.ts:16](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L16)

___

### dp

• `Optional` **dp**: *string*

Defined in: [types.d.ts:17](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L17)

___

### dq

• `Optional` **dq**: *string*

Defined in: [types.d.ts:18](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L18)

___

### e

• `Optional` **e**: *string*

Defined in: [types.d.ts:19](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L19)

___

### ext

• `Optional` **ext**: *boolean*

JWK "ext" (Extractable) Parameter.

Defined in: [types.d.ts:23](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L23)

___

### k

• `Optional` **k**: *string*

Defined in: [types.d.ts:24](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L24)

___

### key\_ops

• `Optional` **key\_ops**: *string*[]

JWK "key_ops" (Key Operations) Parameter.

Defined in: [types.d.ts:28](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L28)

___

### kid

• `Optional` **kid**: *string*

JWK "kid" (Key ID) Parameter.

Defined in: [types.d.ts:32](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L32)

___

### kty

• `Optional` **kty**: *string*

JWK "kty" (Key Type) Parameter.

Defined in: [types.d.ts:36](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L36)

___

### n

• `Optional` **n**: *string*

Defined in: [types.d.ts:37](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L37)

___

### oth

• `Optional` **oth**: { `d?`: *string* ; `r?`: *string* ; `t?`: *string*  }[]

Defined in: [types.d.ts:38](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L38)

___

### p

• `Optional` **p**: *string*

Defined in: [types.d.ts:43](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L43)

___

### q

• `Optional` **q**: *string*

Defined in: [types.d.ts:44](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L44)

___

### qi

• `Optional` **qi**: *string*

Defined in: [types.d.ts:45](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L45)

___

### use

• `Optional` **use**: *string*

JWK "use" (Public Key Use) Parameter.

Defined in: [types.d.ts:49](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L49)

___

### x

• `Optional` **x**: *string*

Defined in: [types.d.ts:50](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L50)

___

### x5c

• `Optional` **x5c**: *string*[]

JWK "x5c" (X.509 Certificate Chain) Parameter.

Defined in: [types.d.ts:55](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L55)

___

### x5t

• `Optional` **x5t**: *string*

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.

Defined in: [types.d.ts:59](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L59)

___

### x5t#S256

• `Optional` **x5t#S256**: *string*

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.

Defined in: [types.d.ts:59](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L59)

___

### x5u

• `Optional` **x5u**: *string*

JWK "x5u" (X.509 URL) Parameter.

Defined in: [types.d.ts:67](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L67)

___

### y

• `Optional` **y**: *string*

Defined in: [types.d.ts:51](https://github.com/panva/jose/blob/v3.10.0/src/types.d.ts#L51)
