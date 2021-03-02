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

*Defined in [src/types.d.ts:219](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L219)*

JWS "alg" (Algorithm) Header Parameter.

___

### b64

• `Optional` **b64**: false \| true

*Defined in [src/types.d.ts:226](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L226)*

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

___

### crit

• `Optional` **crit**: string[]

*Defined in [src/types.d.ts:231](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L231)*

JWS "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: string

*Defined in [src/types.d.ts:208](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L208)*

"cty" (Content Type) Header Parameter.

___

### jwk

• `Optional` **jwk**: Pick<[JWK](_types_d_.jwk.md), \"kty\" \| \"crv\" \| \"x\" \| \"y\" \| \"e\" \| \"n\"\>

*Defined in [src/types.d.ts:198](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L198)*

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:178](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L178)*

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:203](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L203)*

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:188](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L188)*

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:183](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L183)*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:193](https://github.com/panva/jose/blob/v3.7.0/src/types.d.ts#L193)*

"x5u" (X.509 URL) Header Parameter.
