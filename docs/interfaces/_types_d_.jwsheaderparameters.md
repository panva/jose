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

*Defined in [src/types.d.ts:187](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L187)*

JWS "alg" (Algorithm) Header Parameter.

___

### b64

• `Optional` **b64**: false \| true

*Defined in [src/types.d.ts:194](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L194)*

This JWS Extension Header Parameter modifies the JWS Payload
representation and the JWS Signing Input computation as per
[RFC7797](https://tools.ietf.org/html/rfc7797).

___

### crit

• `Optional` **crit**: string[]

*Defined in [src/types.d.ts:199](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L199)*

JWS "crit" (Critical) Header Parameter.

___

### cty

• `Optional` **cty**: string

*Defined in [src/types.d.ts:176](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L176)*

"cty" (Content Type) Header Parameter.

___

### jwk

• `Optional` **jwk**: Pick\<[JWK](_types_d_.jwk.md), \"kty\" \| \"crv\" \| \"x\" \| \"y\" \| \"e\" \| \"n\">

*Defined in [src/types.d.ts:166](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L166)*

"jwk" (JSON Web Key) Header Parameter.

___

### kid

• `Optional` **kid**: string

*Defined in [src/types.d.ts:146](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L146)*

"kid" (Key ID) Header Parameter.

___

### typ

• `Optional` **typ**: string

*Defined in [src/types.d.ts:171](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L171)*

"typ" (Type) Header Parameter.

___

### x5c

• `Optional` **x5c**: string[]

*Defined in [src/types.d.ts:156](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L156)*

"x5c" (X.509 Certificate Chain) Header Parameter.

___

### x5t

• `Optional` **x5t**: string

*Defined in [src/types.d.ts:151](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L151)*

"x5t" (X.509 Certificate SHA-1 Thumbprint) Header Parameter.

___

### x5u

• `Optional` **x5u**: string

*Defined in [src/types.d.ts:161](https://github.com/panva/jose/blob/v3.3.2/src/types.d.ts#L161)*

"x5u" (X.509 URL) Header Parameter.
