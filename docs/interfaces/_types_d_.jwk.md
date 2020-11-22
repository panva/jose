# Interface: JWK

JSON Web Key ([JWK](https://tools.ietf.org/html/rfc7517)).
"RSA", "EC", "OKP", and "oct" key types are supported.

## Index

### Properties

* [alg](_types_d_.jwk.md#alg)
* [crv](_types_d_.jwk.md#crv)
* [d](_types_d_.jwk.md#d)
* [dp](_types_d_.jwk.md#dp)
* [dq](_types_d_.jwk.md#dq)
* [e](_types_d_.jwk.md#e)
* [ext](_types_d_.jwk.md#ext)
* [k](_types_d_.jwk.md#k)
* [key\_ops](_types_d_.jwk.md#key_ops)
* [kid](_types_d_.jwk.md#kid)
* [kty](_types_d_.jwk.md#kty)
* [n](_types_d_.jwk.md#n)
* [oth](_types_d_.jwk.md#oth)
* [p](_types_d_.jwk.md#p)
* [q](_types_d_.jwk.md#q)
* [qi](_types_d_.jwk.md#qi)
* [use](_types_d_.jwk.md#use)
* [x](_types_d_.jwk.md#x)
* [x5c](_types_d_.jwk.md#x5c)
* [x5t](_types_d_.jwk.md#x5t)
* [x5t#S256](_types_d_.jwk.md#x5t#s256)
* [x5u](_types_d_.jwk.md#x5u)
* [y](_types_d_.jwk.md#y)

## Properties

### alg

• `Optional` **alg**: string

*Defined in [src/types.d.ts:12](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L12)*

JWK "alg" (Algorithm) Parameter.

___

### crv

• `Optional` **crv**: string

*Defined in [src/types.d.ts:13](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L13)*

___

### d

• `Optional` **d**: string

*Defined in [src/types.d.ts:14](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L14)*

___

### dp

• `Optional` **dp**: string

*Defined in [src/types.d.ts:15](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L15)*

___

### dq

• `Optional` **dq**: string

*Defined in [src/types.d.ts:16](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L16)*

___

### e

• `Optional` **e**: string

*Defined in [src/types.d.ts:17](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L17)*

___

### ext

• `Optional` **ext**: false \| true

*Defined in [src/types.d.ts:21](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L21)*

JWK "ext" (Extractable) Parameter.

___

### k

• `Optional` **k**: string

*Defined in [src/types.d.ts:22](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L22)*

___

### key\_ops

• `Optional` **key\_ops**: string[]

*Defined in [src/types.d.ts:26](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L26)*

JWK "key_ops" (Key Operations) Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:30](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L30)*

JWK "kid" (Key ID) Parameter.

___

### kty

• `Optional` **kty**: string

*Defined in [src/types.d.ts:34](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L34)*

JWK "kty" (Key Type) Parameter.

___

### n

• `Optional` **n**: string

*Defined in [src/types.d.ts:35](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L35)*

___

### oth

• `Optional` **oth**: Array\<{ d?: string ; r?: string ; t?: string  }>

*Defined in [src/types.d.ts:36](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L36)*

___

### p

• `Optional` **p**: string

*Defined in [src/types.d.ts:41](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L41)*

___

### q

• `Optional` **q**: string

*Defined in [src/types.d.ts:42](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L42)*

___

### qi

• `Optional` **qi**: string

*Defined in [src/types.d.ts:43](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L43)*

___

### use

• `Optional` **use**: string

*Defined in [src/types.d.ts:47](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L47)*

JWK "use" (Public Key Use) Parameter.

___

### x

• `Optional` **x**: string

*Defined in [src/types.d.ts:48](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L48)*

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:53](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L53)*

JWK "x5c" (X.509 Certificate Chain) Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:57](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L57)*

JWK "x5t" (X.509 Certificate SHA-1 Thumbprint) Parameter.

___

### x5t#S256

• `Optional` **x5t#S256**: string

*Defined in [src/types.d.ts:61](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L61)*

"x5t#S256" (X.509 Certificate SHA-256 Thumbprint) Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:65](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L65)*

JWK "x5u" (X.509 URL) Parameter.

___

### y

• `Optional` **y**: string

*Defined in [src/types.d.ts:49](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L49)*
