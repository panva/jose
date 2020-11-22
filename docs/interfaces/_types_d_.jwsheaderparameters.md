# Interface: JWSHeaderParameters

Recognized JWS Header Parameters, any other Header Members
may also be present.

## Indexable

▪ [propName: string]: any

Any other JWS Header member.

## Index

### Properties

* [alg](_types_d_.jwsheaderparameters.md#alg)
* [b64](_types_d_.jwsheaderparameters.md#b64)
* [crit](_types_d_.jwsheaderparameters.md#crit)
* [cty](_types_d_.jwsheaderparameters.md#cty)
* [jwk](_types_d_.jwsheaderparameters.md#jwk)
* [kid](_types_d_.jwsheaderparameters.md#kid)
* [typ](_types_d_.jwsheaderparameters.md#typ)
* [x5c](_types_d_.jwsheaderparameters.md#x5c)
* [x5t](_types_d_.jwsheaderparameters.md#x5t)
* [x5u](_types_d_.jwsheaderparameters.md#x5u)

## Properties

### alg

• `Optional` **alg**: string

*Defined in [src/types.d.ts:185](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L185)*

JWS "alg" (Algorithm) Header Parameter.

___

### b64

• `Optional` **b64**: false \| true

*Defined in [src/types.d.ts:192](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L192)*

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

___

### crit

• `Optional` **crit**: string[]

*Defined in [src/types.d.ts:197](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L197)*

JWS "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: string

*Defined in [src/types.d.ts:174](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L174)*

"cty" (Content Type) Header Parameter.

___

### jwk

• `Optional` **jwk**: Pick\<[JWK](_types_d_.jwk.md), \"kty\" \| \"crv\" \| \"x\" \| \"y\" \| \"e\" \| \"n\">

*Defined in [src/types.d.ts:164](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L164)*

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:144](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L144)*

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:169](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L169)*

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:154](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L154)*

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:149](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L149)*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:159](https://github.com/panva/jose/blob/v3.1.0/src/types.d.ts#L159)*

"x5u" (X.509 URL) Header Parameter.
