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

[types.d.ts:13](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L13)

___

### crv

• `Optional` **crv**: `string`

#### Defined in

[types.d.ts:14](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L14)

___

### d

• `Optional` **d**: `string`

#### Defined in

[types.d.ts:15](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L15)

___

### dp

• `Optional` **dp**: `string`

#### Defined in

[types.d.ts:16](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L16)

___

### dq

• `Optional` **dq**: `string`

#### Defined in

[types.d.ts:17](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L17)

___

### e

• `Optional` **e**: `string`

#### Defined in

[types.d.ts:18](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L18)

___

### ext

• `Optional` **ext**: `boolean`

JWK "ext" (Extractable) Parameter.

#### Defined in

[types.d.ts:22](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L22)

___

### k

• `Optional` **k**: `string`

#### Defined in

[types.d.ts:23](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L23)

___

### key\_ops

• `Optional` **key\_ops**: `string`[]

JWK "key_ops" (Key Operations) Parameter.

#### Defined in

[types.d.ts:27](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L27)

___

### kid

• `Optional` **kid**: `string`

JWK "kid" (Key ID) Parameter.

#### Defined in

[types.d.ts:31](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L31)

___

### kty

• `Optional` **kty**: `string`

JWK "kty" (Key Type) Parameter.

#### Defined in

[types.d.ts:35](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L35)

___

### n

• `Optional` **n**: `string`

#### Defined in

[types.d.ts:36](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L36)

___

### oth

• `Optional` **oth**: { `d?`: `string` ; `r?`: `string` ; `t?`: `string`  }[]

#### Defined in

[types.d.ts:37](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L37)

___

### p

• `Optional` **p**: `string`

#### Defined in

[types.d.ts:42](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L42)

___

### q

• `Optional` **q**: `string`

#### Defined in

[types.d.ts:43](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L43)

___

### qi

• `Optional` **qi**: `string`

#### Defined in

[types.d.ts:44](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L44)

___

### use

• `Optional` **use**: `string`

JWK "use" (Public Key Use) Parameter.

#### Defined in

[types.d.ts:48](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L48)

___

### x

• `Optional` **x**: `string`

#### Defined in

[types.d.ts:49](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L49)

___

### x5c

• `Optional` **x5c**: `string`[]

JWK "x5c" (X.509 Certificate Chain) Parameter.

#### Defined in

[types.d.ts:54](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L54)

___

### x5t

• `Optional` **x5t**: `string`

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.

#### Defined in

[types.d.ts:58](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L58)

___

### x5t#S256

• `Optional` **x5t#S256**: `string`

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.

#### Defined in

[types.d.ts:62](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L62)

___

### x5u

• `Optional` **x5u**: `string`

JWK "x5u" (X.509 URL) Parameter.

#### Defined in

[types.d.ts:66](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L66)

___

### y

• `Optional` **y**: `string`

#### Defined in

[types.d.ts:50](https://github.com/panva/jose/blob/v3.14.4/src/types.d.ts#L50)
