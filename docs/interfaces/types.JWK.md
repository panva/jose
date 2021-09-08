# Interface: JWK

[types](../modules/types.md).JWK

JSON Web Key ([JWK](https://tools.ietf.org/html/rfc7517)).
"RSA", "EC", "OKP", and "oct" key types are supported.

## Indexable

▪ [propName: `string`]: `unknown`

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

#### Defined in

[types.d.ts:84](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L84)

___

### crv

• `Optional` **crv**: `string`

#### Defined in

[types.d.ts:85](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L85)

___

### d

• `Optional` **d**: `string`

#### Defined in

[types.d.ts:86](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L86)

___

### dp

• `Optional` **dp**: `string`

#### Defined in

[types.d.ts:87](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L87)

___

### dq

• `Optional` **dq**: `string`

#### Defined in

[types.d.ts:88](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L88)

___

### e

• `Optional` **e**: `string`

#### Defined in

[types.d.ts:89](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L89)

___

### ext

• `Optional` **ext**: `boolean`

JWK "ext" (Extractable) Parameter.

#### Defined in

[types.d.ts:93](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L93)

___

### k

• `Optional` **k**: `string`

#### Defined in

[types.d.ts:94](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L94)

___

### key\_ops

• `Optional` **key\_ops**: `string`[]

JWK "key_ops" (Key Operations) Parameter.

#### Defined in

[types.d.ts:98](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L98)

___

### kid

• `Optional` **kid**: `string`

JWK "kid" (Key ID) Parameter.

#### Defined in

[types.d.ts:102](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L102)

___

### kty

• `Optional` **kty**: `string`

JWK "kty" (Key Type) Parameter.

#### Defined in

[types.d.ts:106](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L106)

___

### n

• `Optional` **n**: `string`

#### Defined in

[types.d.ts:107](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L107)

___

### oth

• `Optional` **oth**: { `d?`: `string` ; `r?`: `string` ; `t?`: `string`  }[]

#### Defined in

[types.d.ts:108](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L108)

___

### p

• `Optional` **p**: `string`

#### Defined in

[types.d.ts:113](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L113)

___

### q

• `Optional` **q**: `string`

#### Defined in

[types.d.ts:114](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L114)

___

### qi

• `Optional` **qi**: `string`

#### Defined in

[types.d.ts:115](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L115)

___

### use

• `Optional` **use**: `string`

JWK "use" (Public Key Use) Parameter.

#### Defined in

[types.d.ts:119](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L119)

___

### x

• `Optional` **x**: `string`

#### Defined in

[types.d.ts:120](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L120)

___

### x5c

• `Optional` **x5c**: `string`[]

JWK "x5c" (X.509 Certificate Chain) Parameter.

#### Defined in

[types.d.ts:125](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L125)

___

### x5t

• `Optional` **x5t**: `string`

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.

#### Defined in

[types.d.ts:129](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L129)

___

### x5t#S256

• `Optional` **x5t#S256**: `string`

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.

#### Defined in

[types.d.ts:133](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L133)

___

### x5u

• `Optional` **x5u**: `string`

JWK "x5u" (X.509 URL) Parameter.

#### Defined in

[types.d.ts:137](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L137)

___

### y

• `Optional` **y**: `string`

#### Defined in

[types.d.ts:121](https://github.com/panva/jose/blob/v3.16.1/src/types.d.ts#L121)
